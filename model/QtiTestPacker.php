<?php
/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA;
 */

namespace oat\taoQtiPrint\model;

use oat\taoTests\models\pack\Packable;
use oat\taoTests\models\pack\TestPack;
use oat\taoQtiItem\model\pack\QtiItemPacker;
use \taoQtiTest_models_classes_QtiTestService;
use \taoItems_models_classes_ItemsService;
use \core_kernel_classes_Resource;
use \InvalidArgumentException;
use \common_Exception;
use qtism\data\storage\xml\XmlDocument;
use qtism\data\storage\xml\XmlCompactDocument;
use qtism\data\storage\LocalFileResolver;
use qtism\runtime\tests\SessionManager;
use qtism\runtime\rendering\markup\xhtml\XhtmlRenderingEngine;
use \taoQtiTest_helpers_ItemResolver;

/**
 * This class pack a QTI Test. Packing instead of compiling, aims
 * to extract the only data of an test. Those data are used by the
 * test runner to render the test.
 *
 * @package taoQtiTest
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
class QtiTestPacker implements Packable
{

    /**
     * The test type identifier
     * @var string
     */
    private static $testType = 'qtiprint';

    /**
     * packTest implementation for QTI
     * @see {@link Packable}
     * @throws InvalidArgumentException
     * @throws common_Exception
     */
    public function packTest(core_kernel_classes_Resource $test)
    {
        $testPack = null;

        try {

            $qtiTestService = taoQtiTest_models_classes_QtiTestService::singleton();
            $itemService    = taoItems_models_classes_ItemsService::singleton();

            $testFilePath = $qtiTestService->getDocPath($test);

            $route = $this->getRoute($testFilePath);


            $itemPacker     = new QtiItemPacker();
            $items          = array();
            foreach($qtiTestService->getItems($test) as $item){
                $items[$item->getUri()] = $itemPacker->packItem($item, $itemService->getItemFolder($item));
            }
            $testPack       = new TestPack(self::$testType, $route, $items);
        } catch(common_Exception $e){
            throw new common_Exception('Unable to pack test '. $test->getUri() . ' : ' . $e->getMessage());
        }

        return $testPack;
    }

    protected function getRoute($testFilePath){

        $route = array();

        // Load the test definition.
        $testDefinition = new XmlDocument();
        $testDefinition->load($testFilePath);

        // Make the test definition a compact one. Compact tests combine all needed
        // information to run a test instance.
        $resolver = new taoQtiTest_helpers_ItemResolver();
        $compactTestDef = XmlCompactDocument::createFromXmlAssessmentTestDocument($testDefinition, $resolver);

        $sessionManager = new SessionManager();
        $testSession = $sessionManager->createAssessmentTestSession($compactTestDef->getDocumentComponent());

        $renderingEngine = new XhtmlRenderingEngine();

        $testPartId = null;
        $sectionId  = null;

        //We are getting items with their respective test part and sections, so we need to restructure it
        foreach ($testSession->getRoute() as $routeItem) {

            $item = array(
                'id'    => $routeItem->getAssessmentItemRef()->getIdentifier(),
                'href'  => $routeItem->getAssessmentItemRef()->getHref()
            );

            $routeSections = $routeItem->getAssessmentSections()->getArrayCopy();
            $lastSection = $routeSections[count($routeSections) - 1];

            if($sectionId != $lastSection->getIdentifier() || $testPartId != $routeItem->getTestPart()->getIdentifier()){
                $sectionId = $lastSection->getIdentifier();

                $rubricBlocks = array();
                foreach ($routeItem->getAssessmentSections() as $section) {

                    foreach ($section->getRubricBlocks() as $rubricBlock) {
                        $xmlRendering = $renderingEngine->render($rubricBlock);
                        $strRendering = $xmlRendering->saveXML($xmlRendering->documentElement);
                        $finalRendering = '';

                        // No formatting at all :) !
                        foreach (preg_split('/\n|\r/u', $strRendering, -1, PREG_SPLIT_NO_EMPTY) as $line) {
                            $finalRendering .= trim($line);
                        }

                        $rubricBlocks[] = $finalRendering;
                    }
                }
                $section = array(
                    'id'          => $section->getIdentifier(),
                    'title'       => $section->getTitle(),
                    'rubricBlock' => $rubricBlocks,
                    'items'       => array($item)
                );

                if($testPartId != $routeItem->getTestPart()->getIdentifier()){
                    $testPartId = $routeItem->getTestPart()->getIdentifier();
                    $route[] = array(
                        'id' => $testPartId,
                        'sections' => array($section)
                    );

                } else {
                    $this->addSectionToRoute($route, $testPartId, $section);
                }

            } else {
                $route = $this->addItemToRoute($route, $testPartId, $sectionId, $item);
            }
        }
        return $route;
    }

    private function addSectionToRoute($route, $testPartId, $section){
        foreach($route as $i => $routePart){
            if($routePart['id'] == $testPartId){
                $route[$i]['sections'][] = $section;
                break;
            }
        }
        return $route;
    }

    private function addItemToRoute($route, $testPartId, $sectionId, $item){
        foreach($route as $i => $routePart){
            if($routePart['id'] == $testPartId){
                foreach($route[$i]['sections'] as $j => $section){
                    if($section['id'] == $sectionId){
                        $route[$i]['sections'][$j]['items'][] = $item;
                        break;
                    }
                }
            }
        }
        return $route;
    }
}

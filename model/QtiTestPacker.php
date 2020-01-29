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

use common_Exception;
use core_kernel_classes_Resource;
use InvalidArgumentException;
use oat\taoItems\model\pack\Packer;
use oat\taoQtiItem\model\qti\Service;
use oat\taoTests\models\pack\Packable;
use oat\taoTests\models\pack\TestPack;
use qtism\data\storage\xml\XmlCompactDocument;
use qtism\data\storage\xml\XmlDocument;
use qtism\runtime\rendering\markup\xhtml\XhtmlRenderingEngine;
use qtism\runtime\tests\SessionManager;
use taoQtiTest_helpers_ItemResolver;
use taoQtiTest_models_classes_QtiTestService;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorAwareTrait;

/**
 * This class pack a QTI Test. Packing instead of compiling, aims
 * to extract the only data of an test. Those data are used by the
 * test runner to render the test.
 *
 * @package taoQtiTest
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
class QtiTestPacker implements Packable, ServiceLocatorAwareInterface
{
    use ServiceLocatorAwareTrait;

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
            //load resquired services
            $qtiTestService = taoQtiTest_models_classes_QtiTestService::singleton();

            // Load the test definition.
            $testDefinition = $qtiTestService->getDoc($test);

            //load the test data
            $testData        = $this->getRoute($testDefinition);
            $testData['uri'] = $test->getUri();

            //pack each test's item
            $items = [];
            foreach ($qtiTestService->getItems($test) as $item) {
                $itemPacker = new Packer($item, '');
                $this->getServiceLocator()->propagate($itemPacker);
                $items[$item->getUri()] = $itemPacker->pack(['img' => 'base64file']);
            }

            //create the pack
            $testPack = new TestPack(self::$testType, $testData, $items);
        } catch (common_Exception $e) {
            throw new common_Exception('Unable to pack test ' . $test->getUri() . ' : ' . $e->getMessage());
        }

        return $testPack;
    }

    /**
     * Get the route (the way items are delivered into a test).
     * This method will compute the shuffling and other predefined conditions to take the test.
     *
     * @param XmlDocument $testDefinition - the QTI Test definition
     * @return array the test structure as it should be delivered.
     */
    private function getRoute($testDefinition)
    {

        $route = [];

        // Make the test definition a compact one. Compact tests combine all needed
        // information to run a test instance.
        $resolver = new taoQtiTest_helpers_ItemResolver(Service::singleton());
        $compactTestDef = XmlCompactDocument::createFromXmlAssessmentTestDocument($testDefinition, $resolver, $resolver);
        $sessionManager = new SessionManager();
        $testSession = $sessionManager->createAssessmentTestSession($compactTestDef->getDocumentComponent());
        $assessmentTest = $testSession->getAssessmentTest();

        $renderingEngine = new XhtmlRenderingEngine();

        $testPartId = null;
        $sectionId  = null;

        //We are getting items with their respective test part and sections, so we need to restructure it
        foreach ($testSession->getRoute() as $routeItem) {
            $item = [
                'id'    => $routeItem->getAssessmentItemRef()->getIdentifier(),
                'href'  => $routeItem->getAssessmentItemRef()->getHref()
            ];

            $routeSections = $routeItem->getAssessmentSections()->getArrayCopy();
            $lastSection = $routeSections[count($routeSections) - 1];

            if ($sectionId != $lastSection->getIdentifier() || $testPartId != $routeItem->getTestPart()->getIdentifier()) {
                $sectionId = $lastSection->getIdentifier();

                           $rubricBlocks = [];
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
                $section = [
                    'id'          => $section->getIdentifier(),
                    'title'       => $section->getTitle(),
                    'rubricBlock' => $rubricBlocks,
                    'items'       => [$item]
                ];

                if ($testPartId != $routeItem->getTestPart()->getIdentifier()) {
                    $testPartId = $routeItem->getTestPart()->getIdentifier();
                    $route[] = [
                        'id' => $testPartId,
                        'sections' => [$section]
                    ];
                } else {
                    $route = $this->addSectionToRoute($route, $testPartId, $section);
                }
            } else {
                $route = $this->addItemToRoute($route, $testPartId, $sectionId, $item);
            }
        }

        return [
            'id'        => $assessmentTest->getIdentifier(),
            'title'     => $assessmentTest->getTitle(),
            'testParts' => $route
        ];
    }

    /**
     * Add a section to a given test part
     * @param array $route - the route to add the section to
     * @param string $testPartId  - the identifier of the test part to add the section to
     * @param array $section - the section to add
     * @return array the route
     */
    private function addSectionToRoute($route, $testPartId, $section)
    {
        foreach ($route as $i => $routePart) {
            if ($routePart['id'] == $testPartId) {
                $route[$i]['sections'][] = $section;
                break;
            }
        }
        return $route;
    }

    /**
     * Add an item to a given section
     * @param array $route - the route to add the item to
     * @param string $testPartId  - the identifier of the test part that contains the section
     * @param string $sectionId  - the identifier of the section  to add the item to
     * @param array $item - the item to add
     * @return array the route
     */
    private function addItemToRoute($route, $testPartId, $sectionId, $item)
    {
        foreach ($route as $i => $routePart) {
            if ($routePart['id'] == $testPartId) {
                foreach ($route[$i]['sections'] as $j => $section) {
                    if ($section['id'] == $sectionId) {
                        $route[$i]['sections'][$j]['items'][] = $item;
                        break;
                    }
                }
            }
        }
        return $route;
    }
}

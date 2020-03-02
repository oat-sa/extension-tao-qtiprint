<?php

/**
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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA ;
 *
 */

/**
 * @author Jean-Sébastien Conan <jean-sebastien@taotesting.com>
 * @author Jérôme Bogaerts <jerome@taotesting.com>
 */

namespace oat\taoQtiPrint\model;

use oat\generis\model\GenerisRdf;
use oat\generis\model\OntologyAwareTrait;
use oat\oatbox\service\ConfigurableService;
use oat\taoItems\model\pack\encoders\Base64fileEncoder;
use oat\taoItems\model\pack\ExceptionMissingAsset;
use oat\taoQtiItem\model\QtiJsonItemCompiler;
use oat\taoQtiTest\models\CompilationDataService;
use oat\taoQtiTest\models\runner\config\QtiRunnerConfig;
use qtism\data\AssessmentItemRef;
use qtism\data\AssessmentSection;
use taoQtiTest_models_classes_QtiTestService;
use oat\taoDelivery\model\RuntimeService;

/**
 * Class DeliveryPacker
 *
 * Extracts the test definition data from a Delivery.
 * Add the definition of items and theirs related assets, base64 encoded.
 *
 * @package oat\taoQtiPrint\model
 */
class DeliveryPacker extends ConfigurableService
{
    use OntologyAwareTrait;

    const SERVICE_ID = 'taoQtiPrint/DeliveryPacker';

    /**
     * Extracts the test data related to a Delivery
     * @param string $uri
     * @param string $user
     * @return array
     * @throws \Exception
     */
    public function getTestData($uri, $user)
    {
        $runtime = $this->getServiceLocator()->get(RuntimeService::SERVICE_ID)->getRuntime($uri);
        $inputParameters = \tao_models_classes_service_ServiceCallHelper::getInputValues($runtime, []);
        $fileStorage = \tao_models_classes_service_FileStorage::singleton();
        $directoryIds = explode('|', $inputParameters['QtiTestCompilation']);
        $compilationDirs = [
            'private' => $fileStorage->getDirectoryById($directoryIds[0]),
            'public' => $fileStorage->getDirectoryById($directoryIds[1])
        ];

        $deliveryUser = new \core_kernel_users_GenerisUser(new \core_kernel_classes_Resource($user));
        $lang = $deliveryUser->getPropertyValues(GenerisRdf::PROPERTY_USER_DEFLG);
        $userDataLang = empty($lang) ? DEFAULT_LANG : (string)current($lang);

        $config = $this->getServiceLocator()->get(QtiRunnerConfig::SERVICE_ID);
        $reviewConfig = $config->getConfigValue('review');
        $displaySubsectionTitle = isset($reviewConfig['displaySubsectionTitle']) ? (bool)$reviewConfig['displaySubsectionTitle'] : true;

        $testDefinition = $this->getCompilationDataService()->readCompilationData($compilationDirs['private'], taoQtiTest_models_classes_QtiTestService::TEST_COMPILED_FILENAME);

        $lastPart = null;
        $lastSection = null;
        $testData = [
            'type' => 'qtiprint',
            'data' => [
                'id' => $testDefinition->getIdentifier(),
                'uri' => $uri,
                'title' => $testDefinition->getTitle(),
                'testParts' => [],
            ],
            'items' => [],
        ];

        foreach ($testDefinition->getTestParts() as $testPart) {
            $assessmentSectionStack = [];

            foreach ($testPart->getAssessmentSections() as $assessmentSection) {
                $trail = [];
                $mark = [];

                array_push($trail, $assessmentSection);

                while (count($trail) > 0) {
                    $current = array_pop($trail);

                    if (!in_array($current, $mark, true) && $current instanceof AssessmentSection) {
                        // 1st pass on assessmentSection.
                        $currentAssessmentSection = $current;
                        array_push($assessmentSectionStack, $currentAssessmentSection);

                        array_push($mark, $current);
                        array_push($trail, $current);

                        // Ask for next level traversal.
                        foreach (array_reverse($current->getSectionParts()->getArrayCopy()) as $sectionPart) {
                            array_push($trail, $sectionPart);
                        }
                    } elseif (in_array($current, $mark, true)) {
                        array_pop($assessmentSectionStack);
                    } elseif ($current instanceof AssessmentItemRef) {
                        // leaf node.
                        // AssessmentSectionHierarchy of AssessmentItemRef is in $assessmentSectionStack
                        // Test Part of AssessmentItemRef is in $testPart

                        $partId = $testPart->getIdentifier();

                        $sections = [];
                        foreach ($assessmentSectionStack as $assessmentSectionAncestor) {
                            array_push($sections, $assessmentSectionAncestor);
                        }
                        if ($displaySubsectionTitle) {
                            $section = array_pop($sections);
                        } else {
                            $section = array_shift($sections);
                        }
                        $sectionId = $section->getIdentifier();
                        $itemId = $current->getIdentifier();
                        $itemUri = strstr($current->getHref(), '|', true);

                        if ($lastPart != $partId) {
                            $lastPart = $partId;
                        }
                        if ($lastSection != $sectionId) {
                            $lastSection = $sectionId;
                        }

                        if (!isset($testData['data']['testParts'][$partId])) {
                            $testData['data']['testParts'][$partId] = [
                                'id' => $partId,
                                'sections' => [],
                            ];
                        }
                        if (!isset($testData['data']['testParts'][$partId]['sections'][$sectionId])) {
                            $testData['data']['testParts'][$partId]['sections'][$sectionId] = [
                                'id' => $sectionId,
                                'title' => $section->getTitle(),
                                'rubricBlock' => '', // TODO: get the rubric block from the delivery
                                'items' => [],
                            ];

                            if ($section->getSelection() && $section->getSelection()->getSelect()) {
                                $testData['data']['testParts'][$partId]['sections'][$sectionId]['select'] =
                                    $section->getSelection()->getSelect();
                            }
                        }

                        $testData['data']['testParts'][$partId]['sections'][$sectionId]['items'][] = [
                            'id' => $itemId,
                            'href' => $itemUri,
                        ];

                        $testData['items'][$itemUri] = $this->getItemData($current->getHref(), $userDataLang);
                    }
                }
            }
        }

        return $testData;
    }

    /**
     * Gets the definition of an item
     * @param string $itemRef
     * @param string $userDataLang
     * @return array
     * @throws \common_Exception
     * @throws \common_exception_InconsistentData
     * @throws \tao_models_classes_FileNotFoundException
     */
    protected function getItemData($itemRef, $userDataLang)
    {
        $directoryIds = explode('|', $itemRef);
        if (count($directoryIds) < 3) {
            throw new \common_exception_InconsistentData('The itemRef is not formatted correctly');
        }

        $itemUri = $directoryIds[0];
        $publicDirectory = \tao_models_classes_service_FileStorage::singleton()->getDirectoryById($directoryIds[1]);
        $privateDirectory = \tao_models_classes_service_FileStorage::singleton()->getDirectoryById($directoryIds[2]);

        if ($privateDirectory->has($userDataLang)) {
            $lang = $userDataLang;
        } elseif ($privateDirectory->has(DEFAULT_LANG)) {
            \common_Logger::i(
                $userDataLang . ' is not part of compilation directory for item : ' . $itemUri . ' use ' . DEFAULT_LANG
            );
            $lang = DEFAULT_LANG;
        } else {
            throw new \common_Exception(
                'item : ' . $itemUri . 'is neither compiled in ' . $userDataLang . ' nor in ' . DEFAULT_LANG
            );
        }

        $fileName = QtiJsonItemCompiler::ITEM_FILE_NAME;
        try {
            return $this->resolveAssets(
                json_decode($privateDirectory->read($lang . DIRECTORY_SEPARATOR . $fileName), true),
                $publicDirectory,
                $lang
            );
        } catch (\FileNotFoundException $e) {
            throw new \tao_models_classes_FileNotFoundException(
                $fileName . ' for item reference ' . $itemRef
            );
        }
    }

    /**
     * @param array $itemData
     * @param \tao_models_classes_service_StorageDirectory $publicDirectory
     * @param string $lang
     * @return array
     */
    protected function resolveAssets($itemData, $publicDirectory, $lang)
    {
        $itemData['baseUrl'] = $publicDirectory->getPublicAccessUrl() . $lang . '/';
        $encoder = new Base64fileEncoder($publicDirectory);

        $allowedTypes = ['img', 'css'];

        if (isset($itemData['assets'])) {
            foreach ($itemData['assets'] as $type => &$assets) {
                if (in_array($type, $allowedTypes)) {
                    foreach ($assets as $uri => $asset) {
                        try {
                            $assets[$uri] = $encoder->encode($lang . '/' . $asset);
                        } catch (ExceptionMissingAsset $e) {
                        }
                    }
                }
            }
        }

        return $itemData;
    }

    /**
     * @return CompilationDataService
     */
    private function getCompilationDataService()
    {
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return $this->getServiceLocator()->get(CompilationDataService::SERVICE_ID);
    }
}

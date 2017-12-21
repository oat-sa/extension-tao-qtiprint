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
 */

namespace oat\taoQtiPrint\model;

use oat\generis\model\GenerisRdf;
use oat\taoDelivery\model\execution\ServiceProxy;
use oat\taoOutcomeUi\helper\ResponseVariableFormatter;
use oat\taoOutcomeUi\model\ResultsService;
use oat\taoQtiTest\models\runner\config\QtiRunnerConfig;
use oat\taoQtiTest\models\runner\rubric\QtiRunnerRubric;
use oat\taoQtiTest\models\TestSessionService;
use oat\taoResultServer\models\classes\ResultServerService;

/**
 * Class DeliveryExecutionPacker
 * 
 * Extracts the test definition data from a DeliveryExecution.
 * Add the definition of items and theirs related assets, base64 encoded.
 * Extracts the result variables related to a DeliveryExecution.
 * 
 * @package oat\taoQtiPrint\model
 */
class DeliveryExecutionPacker extends DeliveryPacker
{
    const SERVICE_ID = 'taoQtiPrint/DeliveryExecutionPacker';
    
    /**
     * Extracts the result variables related to a DeliveryExecution
     * @param string $uri
     * @return array
     */
    public function getResultVariables($uri)
    {
        $deliveryExecution = ServiceProxy::singleton()->getDeliveryExecution($uri);
        $resultServerService = $this->getServiceLocator()->get(ResultServerService::SERVICE_ID);
        $resultStorage = $resultServerService->getResultStorage($deliveryExecution->getDelivery());
        $resultsService = ResultsService::singleton();
        $resultsService->setImplementation($resultStorage);

        $displayedVariables = $resultsService->getStructuredVariables($uri, 'lastSubmitted', [\taoResultServer_models_classes_ResponseVariable::class]);
        $responses = ResponseVariableFormatter::formatStructuredVariablesToItemState($displayedVariables);
        $excludedVariables = array_flip(['numAttempts', 'duration']);

        $resultVariables = [];
        foreach ($displayedVariables as &$item) {
            if (!isset($item['uri'])) {
                continue;
            }
            $itemUri = $item['uri'];
            if (isset($responses[$itemUri])) {
                $resultVariables[$itemUri] = array_diff_key($responses[$itemUri], $excludedVariables);
                if (!count($resultVariables[$itemUri])) {
                    $resultVariables[$itemUri] = null;
                }
            } else {
                $resultVariables[$itemUri] = null;
            }
        }

        return $resultVariables;
    }

    /**
     * Extracts the test data related to a DeliveryExecution
     * @param string $uri
     * @return array
     */
    public function getTestData($uri, $user = '')
    {
        $deliveryExecution = ServiceProxy::singleton()->getDeliveryExecution($uri);
        $userIdentifier = $deliveryExecution->getUserIdentifier();
        $deliveryUser = new \core_kernel_users_GenerisUser(new \core_kernel_classes_Resource($userIdentifier));
        $lang = $deliveryUser->getPropertyValues(GenerisRdf::PROPERTY_USER_DEFLG);
        $userDataLang = empty($lang) ? DEFAULT_LANG : (string)current($lang);

        $testSessionService = $this->getServiceLocator()->get(TestSessionService::SERVICE_ID);
        /* @var \qtism\runtime\tests\AssessmentTestSession $testSession */
        $testSession = $testSessionService->getTestSession($deliveryExecution);
        $inputParameters = $testSessionService->getRuntimeInputParameters($deliveryExecution);
        $fileStorage = \tao_models_classes_service_FileStorage::singleton();
        $directoryIds = explode('|', $inputParameters['QtiTestCompilation']);
        $compilationDirs = array(
            'private' => $fileStorage->getDirectoryById($directoryIds[0]),
            'public' => $fileStorage->getDirectoryById($directoryIds[1])
        );
        $assessmentTest = $testSession->getAssessmentTest();
        $route = $testSession->getRoute();
        $routeItems = $route->getAllRouteItems();
        $lastPart = null;
        $lastSection = null;
        $testData = [
            'type' => 'qtiprint',
            'data' => [
                'id' => $assessmentTest->getIdentifier(),
                'uri' => $uri,
                'title' => $assessmentTest->getTitle(),
                'testParts' => [],
            ],
            'items' => [],
        ];

        $rubricBlockHelper = $this->getServiceLocator()->get(QtiRunnerRubric::SERVICE_ID);
        $config = $this->getServiceLocator()->get(QtiRunnerConfig::SERVICE_ID);
        $reviewConfig = $config->getConfigValue('review');
        $displaySubsectionTitle = isset($reviewConfig['displaySubsectionTitle']) ? (bool)$reviewConfig['displaySubsectionTitle'] : true;

        foreach ($routeItems as $routeItem) {
            $itemRef = $routeItem->getAssessmentItemRef();
            $testPart = $routeItem->getTestPart();
            $partId = $testPart->getIdentifier();

            if ($displaySubsectionTitle) {
                $section = $routeItem->getAssessmentSection();
            } else {
                $sections = $routeItem->getAssessmentSections()->getArrayCopy();
                $section = $sections[0];
            }
            $sectionId = $section->getIdentifier();
            $itemId = $itemRef->getIdentifier();
            $itemUri = strstr($itemRef->getHref(), '|', true);

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
                    'rubricBlock' => $rubricBlockHelper->getRubricBlock($routeItem, $testSession, $compilationDirs),
                    'items' => [],
                ];
            }

            $testData['data']['testParts'][$partId]['sections'][$sectionId]['items'][] = [
                'id' => $itemId,
                'href' => $itemUri,
            ];

            $testData['items'][$itemUri] = $this->getItemData($itemRef->getHref(), $userDataLang);
        }

        return $testData;
    }
}

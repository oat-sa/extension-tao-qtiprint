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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA ;
 *
 */

/**
 * The QTI Print renderer configuration
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'taoItems/assets/manager',
    'taoItems/assets/strategies'
], function(assetManagerFactory, assetStrategies){
    'use strict';


    //asset manager using base url
    var assetManager = assetManagerFactory([
        assetStrategies.taomedia,
        assetStrategies.external,
        assetStrategies.base64,
        assetStrategies.baseUrl
    ], {baseUrl : ''});

    /**
     * @exports taoQtiPrint/qtiPrintRenderer/renderers/config
     */
    return {
        name        : 'printRenderer',
        locations   : {
            'assessmentItem':                              'taoQtiPrint/qtiPrintRenderer/renderers/Item',
            '_container':                                  'taoQtiPrint/qtiPrintRenderer/renderers/Container',
            'stylesheet':                                  'taoQtiPrint/qtiPrintRenderer/renderers/Stylesheet',
            'img':                                         'taoQtiPrint/qtiPrintRenderer/renderers/Img',
            'rubricBlock':                                 'taoQtiPrint/qtiPrintRenderer/renderers/RubricBlock',
            'object':                                      'taoQtiPrint/qtiPrintRenderer/renderers/Object',
            'prompt':                                      'taoQtiPrint/qtiPrintRenderer/renderers/interactions/Prompt',
            'choiceInteraction':                           'taoQtiPrint/qtiPrintRenderer/renderers/interactions/ChoiceInteraction',
            'matchInteraction':                            'taoQtiPrint/qtiPrintRenderer/renderers/interactions/MatchInteraction',
            'inlineChoiceInteraction':                     'taoQtiPrint/qtiPrintRenderer/renderers/interactions/InlineChoiceInteraction',
            'extendedTextInteraction':                     'taoQtiPrint/qtiPrintRenderer/renderers/interactions/ExtendedTextInteraction',
            'textEntryInteraction':                        'taoQtiPrint/qtiPrintRenderer/renderers/interactions/TextEntryInteraction',
            'simpleChoice.choiceInteraction':              'taoQtiPrint/qtiPrintRenderer/renderers/choices/SimpleChoice.ChoiceInteraction',
            'simpleAssociableChoice.matchInteraction':     'taoQtiPrint/qtiPrintRenderer/renderers/choices/SimpleAssociableChoice.MatchInteraction',
            'inlineChoice':                                'taoQtiPrint/qtiPrintRenderer/renderers/choices/InlineChoice',
            'math':                                        'taoQtiPrint/qtiPrintRenderer/renderers/Math',
            'include':                                     'taoQtiPrint/qtiPrintRenderer/renderers/Include',

//do not print
            '_simpleFeedbackRule':                         false,
            'outcomeDeclaration':                          false,
            'responseDeclaration':                         false,
            'responseProcessing':                          false,
            'modalFeedback':                               false,

//not implemented
            'orderInteraction':                            false,
            'associateInteraction':                        false,
            'sliderInteraction':                           false,
            'simpleChoice.orderInteraction':               false,
            'hottext':                                     false,
            'gap':                                         false,
            'gapText':                                     false,
            'simpleAssociableChoice.associateInteraction': false,
            'hottextInteraction':                          false,
            'hotspotInteraction':                          false,
            'hotspotChoice':                               false,
            'associableHotspot':                           false,
            'gapMatchInteraction':                         false,
            'selectPointInteraction':                      false,
            'graphicOrderInteraction':                     false,
            'mediaInteraction':                            false,
            'uploadInteraction':                           false,
            'graphicGapMatchInteraction':                  false,
            'gapImg':                                      false,
            'graphicAssociateInteraction':                 false,
            'customInteraction':                           false,
            'infoControl':                                 false,
            'endAttemptInteraction':                       false
        },
        options:   {
            assetManager: assetManager
        }
    };
});

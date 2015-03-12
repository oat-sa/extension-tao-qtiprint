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
define([], function(){
    'use strict';

    /**
     * @exports taoQtiItemPrint/qtiPrintRenderer/renderers/config
     */
    return {
        name        : 'printRenderer',
        locations   : {
            'assessmentItem':                              'taoQtiItemPrint/qtiPrintRenderer/renderers/Item',
            '_container':                                  'taoQtiItemPrint/qtiPrintRenderer/renderers/Container',
            'stylesheet':                                  'taoQtiItemPrint/qtiPrintRenderer/renderers/Stylesheet',
            'img':                                         'taoQtiItemPrint/qtiPrintRenderer/renderers/Img',
            'rubricBlock':                                 'taoQtiItemPrint/qtiPrintRenderer/renderers/RubricBlock',
            'object':                                      'taoQtiItemPrint/qtiPrintRenderer/renderers/Object',
            'prompt':                                      'taoQtiItemPrint/qtiPrintRenderer/renderers/interactions/Prompt',
            'choiceInteraction':                           'taoQtiItemPrint/qtiPrintRenderer/renderers/interactions/ChoiceInteraction',
            'extendedTextInteraction':                     'taoQtiItemPrint/qtiPrintRenderer/renderers/interactions/ExtendedTextInteraction',
            'textEntryInteraction':                        'taoQtiItemPrint/qtiPrintRenderer/renderers/interactions/TextEntryInteraction',
            'simpleChoice.choiceInteraction':              'taoQtiItemPrint/qtiPrintRenderer/renderers/choices/SimpleChoice.ChoiceInteraction',

//do not print
            '_simpleFeedbackRule':                         false,
            'outcomeDeclaration':                          false,
            'responseDeclaration':                         false,
            'responseProcessing':                          false,
            'modalFeedback':                               false,

//not implemented
            'orderInteraction':                            false,
            'associateInteraction':                        false,
            'matchInteraction':                            false,
            'sliderInteraction':                           false,
            'simpleChoice.orderInteraction':               false,
            'hottext':                                     false,
            'gap':                                         false,
            'gapText':                                     false,
            'simpleAssociableChoice.matchInteraction':     false,
            'simpleAssociableChoice.associateInteraction': false,
            'hottextInteraction':                          false,
            'hotspotInteraction':                          false,
            'gapMatchInteraction':                         false,
            'inlineChoiceInteraction':                     false,
            'inlineChoice':                                false,
            'selectPointInteraction':                      false,
            'graphicOrderInteraction':                     false,
            'mediaInteraction':                            false,
            'uploadInteraction':                           false,
            'graphicGapMatchInteraction':                  false,
            'gapImg':                                      false,
            'graphicAssociateInteraction':                 false,
            'customInteraction':                           false,
            'infoControl':                                 false,
            'endAttemptInteraction':                       false,
        }
    };
});

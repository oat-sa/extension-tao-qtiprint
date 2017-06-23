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
 */
/**
 * @author Jean-Sébastien Conan <jean-sebastien@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'i18n',
    'tpl!taoQtiPrint/qtiPrintRenderer/tpl/interactions/rawResponse',
    'tpl!taoQtiPrint/qtiPrintRenderer/tpl/interactions/responsesList',
    'taoQtiPrint/qtiPrintRenderer/helpers/container',
    'taoQtiItem/qtiCommonRenderer/helpers/PciResponse'
], function ($, _, __, tpl, responsesTpl, getContainer, pciResponse) {
    'use strict';

    /**
     * Creates a fallback interaction that only displays the raw responses
     * @param qtiClass
     * @returns {Object}
     */
    function interactionRawResponse(qtiClass) {
        return {
            qtiClass: qtiClass,
            template: tpl,
            getContainer: getContainer,
            getData: function getData(interaction, data) {
                return _.merge(data || {}, {
                    qtiClass: qtiClass,
                    message: __('The interaction "%s" is not fully supported for printing purpose, only the raw responses will be rendered', qtiClass)
                });
            },
            setResponse: function setResponse(interaction, response) {

                var $container = interaction.getContainer();
                var $responses = $('.responses', $container).empty();
                var responseValue;

                try {
                    responseValue = pciResponse.unserialize(response, interaction);
                } catch (e) {
                }

                if (responseValue && responseValue.length) {
                    $responses.html(responsesTpl({
                        responses: [{
                            name: interaction.attributes.responseIdentifier,
                            value: responseValue.join(', ')
                        }]
                    }));
                }
            },
            setState: function setState(interaction, state) {
                if (_.isObject(state)) {
                    if (state.response) {
                        interaction.resetResponse();
                        interaction.setResponse(state.response);
                    }
                }
            }
        };
    }

    return interactionRawResponse;
});
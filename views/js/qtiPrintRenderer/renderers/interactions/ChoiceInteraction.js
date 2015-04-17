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
 */

/**
 * The choice interaction renderer
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'lodash',
    'tpl!taoQtiPrint/qtiPrintRenderer/tpl/interactions/choiceInteraction',
    'taoQtiPrint/qtiPrintRenderer/helpers/container'
], function(_, tpl, getContainer){
    'use strict';

    /**
     * Expose the renderer
     * @exports taoQtiPrint/qtiPrintRenderer/renderers/interactions/ChoiceInteraction
     */
    return {
        qtiClass:     'choiceInteraction',
        template:     tpl,
        getContainer: getContainer,
        getData:      function getCustomData(interaction, data){
            return _.merge(data || {}, {
                horizontal : (interaction.attr('orientation') === 'horizontal')
            });
        }
    };
});

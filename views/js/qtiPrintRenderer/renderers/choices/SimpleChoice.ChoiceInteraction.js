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
 * The simple choice renderer
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
   'tpl!taoQtiPrint/qtiPrintRenderer/tpl/choices/simpleChoice.choiceInteraction',
   'taoQtiPrint/qtiPrintRenderer/helpers/container'
], function(tpl, getContainer){
    'use strict';

    /**
     * Detects image of relative size in choice
     * @param {jQuery} $container 
     * @returns {boolean} flag if simple choice has relative sized image
     */
    function hasRelativeSizedImage($container) {
        let flag = false;
        const $img = $container.find('img');
        if($img && $img.length && $img.attr('width') && ~$img.attr('width').indexOf('%')) {
            flag = true;    
        }
        return flag;
    }

    /**
     * Expose the renderer
     * @exports taoQtiPrint/qtiPrintRenderer/renderers/choices/SimpleChoice.ChoiceInteration
     */
    return {
        qtiClass:     'simpleChoice.choiceInteraction',
        getContainer: getContainer,
        template:     tpl,
        getData:      function(choice, data){
            data.unique = (parseInt(data.interaction.attributes.maxChoices) === 1);
            return data;
        },
        render: function(simpleChoice) {
            const $container = getContainer(simpleChoice);
            if(hasRelativeSizedImage($container)) {

                const $img = $container.find('img');
                const $label = $container.find('label');
                const $qtiBlock = $container.find('.qti-block');
                $label.attr('data-has-relative-image', 'true');
                $qtiBlock.css('background-image', `url('${$img.attr("src")}'`);
            }
        }
    };
});

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
 * The math renderer
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'tpl!taoQtiPrint/qtiPrintRenderer/tpl/math',
    'taoQtiPrint/qtiPrintRenderer/helpers/container',
    'mathJax'
], function(tpl, getContainer, MathJax){
    'use strict';

    /**
     * Expose the renderer
     * @exports taoQtiPrint/qtiPrintRenderer/renderers/Math
     */
    return {
        qtiClass:     'math',
        template:     tpl,
        getContainer: getContainer,
        render: function(math, data){
            if(typeof(MathJax) !== 'undefined' && MathJax){
                _.delay(function(){//defer execution fix some rendering issue in chrome
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, getContainer(math).parent()[0]]);
                },60);
            }
        }
    };
});

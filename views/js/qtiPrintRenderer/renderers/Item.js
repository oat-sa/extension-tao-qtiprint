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
 * The item renderer
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'tpl!taoQtiItemPrint/qtiPrintRenderer/tpl/item',
    'taoQtiItemPrint/qtiPrintRenderer/helpers/container',
    'taoQtiItemPrint/qtiPrintRenderer/helpers/itemStylesheetHandler'
], function(tpl, getContainer, itemStylesheetHandler) {
    'use strict';

    /**
     * Expose the renderer
     * @exports taoQtiItemPrint/qtiPrintRenderer/renderers/Item
     */
    return {
        qtiClass:     'assessmentItem',
        template:     tpl,
        getContainer: getContainer,
        render:       function(item) {
            //add stylesheets
            itemStylesheetHandler.attach(item.stylesheets);
        }
    };
});

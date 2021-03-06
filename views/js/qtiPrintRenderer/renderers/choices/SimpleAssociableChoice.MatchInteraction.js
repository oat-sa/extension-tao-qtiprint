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
 * Copyright (c) 2017 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 */

/**
 * The match choice renderer
 *
 * @author Jean-Sebastien CONAN <jean-sebastien@taotesting.com>
 */
define([
    'tpl!taoQtiPrint/qtiPrintRenderer/tpl/choices/simpleAssociableChoice.matchInteraction',
    'taoQtiPrint/qtiPrintRenderer/helpers/container'
], function (tpl, getContainer) {
    'use strict';

    /**
     * Expose the renderer
     * @exports taoQtiPrint/qtiPrintRenderer/renderers/choices/simpleAssociableChoice.matchInteraction
     */
    return {
        qtiClass : 'simpleAssociableChoice.matchInteraction',
        getContainer : getContainer,
        template : tpl
    };
});

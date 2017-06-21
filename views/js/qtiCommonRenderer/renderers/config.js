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
    'taoQtiItem/qtiCommonRenderer/renderers/config',
    'taoQtiPrint/qtiPrintRenderer/renderers/interactions/NotSupported',
    'taoQtiPrint/qtiPrintRenderer/renderers/interactions/RawResponse'
], function(defaultConfig, NotSupported, RawResponse){
    'use strict';

    /**
     * Applies a custom renderer for a particular interaction
     * @param {String} qtiClass
     * @param {Function} rendererFactory
     */
    function applyRenderer(qtiClass, rendererFactory) {
        var moduleUri = 'taoQtiPrint/qtiPrintRenderer/renderers/' + qtiClass;
        define(moduleUri, rendererFactory(qtiClass));

        defaultConfig.locations[qtiClass] = moduleUri;
    }

    /**
     * Defines an interaction that is not supported
     * @param qtiClass
     */
    function defineNotSupported(qtiClass) {
        applyRenderer(qtiClass, NotSupported);
    }

    /**
     * Defines an interaction that will only display raw responses
     * @param qtiClass
     */
    function defineRawResponse(qtiClass) {
        applyRenderer(qtiClass, RawResponse);
    }

    // apply some tweaks to fit the print needs
    defaultConfig.options.enableDragAndDrop = null;

    // defines the interaction that are not supported
    defineNotSupported('mediaInteraction');
    defineNotSupported('uploadInteraction');

    // defines the interaction that are partially supported: only the raw responses will be rendered
    // @todo: fix those interactions
    defineRawResponse('graphicAssociateInteraction');
    defineRawResponse('graphicOrderInteraction');
    defineRawResponse('selectPointInteraction');
    defineRawResponse('hotspotInteraction');
    defineRawResponse('graphicGapMatchInteraction');

    return defaultConfig;
});

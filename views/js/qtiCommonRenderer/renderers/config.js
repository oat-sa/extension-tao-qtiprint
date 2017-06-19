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
    'taoQtiPrint/qtiPrintRenderer/renderers/interactions/NotSupported'
], function(defaultConfig, NotSupported){
    'use strict';

    // apply some tweaks to fit the print needs
    defaultConfig.options.enableDragAndDrop = null;

    // defines the interaction that are not supported
    define('taoQtiPrint/qtiPrintRenderer/renderers/mediaInteraction', NotSupported('mediaInteraction'));
    define('taoQtiPrint/qtiPrintRenderer/renderers/uploadInteraction', NotSupported('uploadInteraction'));

    defaultConfig.locations.mediaInteraction = 'taoQtiPrint/qtiPrintRenderer/renderers/mediaInteraction';
    defaultConfig.locations.uploadInteraction = 'taoQtiPrint/qtiPrintRenderer/renderers/uploadInteraction';

    return defaultConfig;
});
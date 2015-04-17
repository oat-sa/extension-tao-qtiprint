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
 * Helps you to retrieve the element container
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'taoQtiItem/qtiItem/core/Element'
], function($, Element) {
    'use strict';

    /**
     * Helps you to retrieve the DOM element (as a jquery element)
     * @exports taoQtiPrint/qtiPrintRenderer/helpers/container
     *
     * Get the container of the given element
     * @param {QtiElement} element - the QTI Element to find the container for
     * @param {jQueryElement} [$scope] - if present scope of the container
     * @returns {jQueryElement} the container
     */
    return function getContainer(element, $scope) {

        var serial = element.getSerial();
        var selector = '[data-serial=' + serial + ']';

        if (Element.isA(element, 'choice')) {
            selector = '.qti-choice' + selector;
        } else if (Element.isA(element, 'interaction')) {
            selector = '.qti-interaction' + selector;
        }

        return $scope && $scope.length ? $(selector, $scope) : $(selector);
    };
});


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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 */

/**
 * @author Jean-Sébastien Conan <jean-sebastien@taotesting.com>
 */
define(['lodash', 'core/eventifier'], function (_, eventifier) {
    'use strict';

    /**
     * Defines an iterator to iterate over each test elements
     * @param {Object} testDefinition
     * @returns {testIterator}
     */
    function testIteratorFactory(testDefinition) {
        var testData = testDefinition.data || {};
        var items = testDefinition.items || {};
        var states = testDefinition.states || {};

        /**
         * Defines an iterator to iterate over each test element
         * @typedef {testIterator}
         */
        return eventifier({
            iterate: function iterate() {
                var self = this;

                self.trigger('test', testData);

                _.forEach(testData.testParts, function (testPart) {
                    self.trigger('testPart', testPart);

                    _.forEach(testPart.sections, function (section) {
                        self.trigger('section', section);

                        _.forEach(section.items, function (item) {
                            self.trigger('item', item, items[item.href], states[item.href]);
                        });
                    });
                });
            }
        });
    }

    return testIteratorFactory;
});


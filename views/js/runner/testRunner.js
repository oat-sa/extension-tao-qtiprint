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
 * Copyright (c) 2015-2017 (original work) Open Assessment Technologies SA;
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'async',
    'core/eventifier',
    'taoQtiPrint/runner/testIterator',
    'taoQtiPrint/runner/testRenderers',
    'tpl!taoQtiPrint/runner/tpl/pageBlock'
], function ($,
             _,
             asyncLib,
             eventifier,
             testIteratorFactory,
             testRenderers,
             pageBlockTpl) {
    'use strict';

    /**
     *
     * Builds a brand new {@link TestRunner}.
     *
     * <strong>The factory is an internal mechanism to create encapsulated contexts.
     *  I suggest you to use directly the name <i>testRunner</i> when you require this module.</strong>
     *
     *
     * @exports testRunner
     * @namespace testRunnerFactory
     *
     *
     * @returns {testRunner}
     */
    var testRunnerFactory = function testRunnerFactory(testData, options) {
        var layoutOptions = options && options.layout || {};
        var testIterator = testIteratorFactory(testData);
        var $container;

        /**
         * Creates a container for a test block
         * @param {String} type
         * @returns {jQuery}
         */
        function createPage(type) {
            var $pageBlock = $(pageBlockTpl({type: type}));
            $container.append($pageBlock);
            return $pageBlock;
        }

        testData = testData || {};

        if (!testData || !testData.data || !testData.items) {
            throw new Error('Invalid test data structure');
        }

        /**
         * @typedef {testRunner}
         */
        return eventifier({
            /**
             * Makes the rendering of the full test.
             *
             * @param {HTMLElement|jQueryElement} elt - the DOM element that is going to contain the rendered test.
             * @returns {testRunner} to chain calls
             *
             * @fires testRunner#ready
             * @fires testRunner#render
             * @fires testRunner#error if the elt isn't valid
             */
            render: function render(elt) {
                var self = this;
                var pageRenderers = [];

                //check elt
                if (!(elt instanceof HTMLElement) && !(elt instanceof $)) {
                    return self.trigger('error', 'A valid HTMLElement (or a jquery element) at least is required to render the test');
                }

                //we keep a reference to the container
                if (elt instanceof $) {
                    $container = elt;
                } else {
                    $container = $(elt);
                }
                $container.empty();

                //dummy rtl support from options
                if (options && options.rtl === true) {
                    $container.addClass('rtl').attr('dir', 'rtl');
                }

                //Build the pageRenderers array that contains each page to render
                //Transform the functions of the renderer to fit the format required by async (partial with data and binding)
                testIterator
                    .on('test', function (test) {
                        if (layoutOptions['cover_page']) {
                            pageRenderers.push(
                                _.partial(testRenderers.testPage, createPage('title'), test, options)
                            );
                        }
                    })
                    .on('section', function (section) {
                        pageRenderers.push(
                            _.partial(testRenderers.sectionPage, createPage('section'), section)
                        );
                    })
                    .on('item', function (item, itemRef, itemState) {
                        if (itemRef && itemRef.data) {
                            itemRef.renderer = options.regular ? 'taoQtiItem' : 'taoQtiPrint';
                            pageRenderers.push(
                                _.partial(testRenderers.itemPage, createPage('item'), itemRef, itemState, item.href)
                            );
                        }
                    })
                    .iterate();

                //then we call all the renderers in parallel
                asyncLib.parallel(pageRenderers, function renderingDone(err) {
                    if (err) {
                        self.trigger('error', 'An error occurred while rendering a page :  ' + err);
                    }

                    /**
                     * The test is rendered
                     * @event TestRunner#render
                     */
                    self.trigger('render');

                    /**
                     * The test is ready.
                     * Alias of {@link TestRunner#render}
                     * @event TestRunner#ready
                     */
                    self.trigger('ready');
                });

                return this;
            },

            /**
             * Clears the running test.
             * @returns {testRunner}
             *
             * @fires testRunner#clear
             */
            clear: function clear() {

                $container.empty();

                /**
                 * The test is ready.
                 * @event TestRunner#clear
                 */
                this.trigger('clear');

                return this;
            }
        });
    };

    return testRunnerFactory;
});

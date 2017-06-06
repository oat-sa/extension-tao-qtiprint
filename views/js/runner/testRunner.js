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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA;
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'async',
    'util/url',
    'core/eventifier',
    'taoQtiPrint/runner/itemRunner',
    'taoItems/assets/strategies',
    'taoQtiPrint/lib/qrcode',
    'tpl!taoQtiPrint/runner/tpl/pageTest',
    'tpl!taoQtiPrint/runner/tpl/pageSection',
    'tpl!taoQtiPrint/runner/tpl/pageItem'
], function ($,
             _,
             asyncLib,
             urlHelper,
             eventifier,
             itemRunner,
             assetStrategies,
             QRCode,
             pageTestTpl,
             pageSectionTpl,
             pageItemTpl) {
    'use strict';

    //TODO find him his own place. Waiting is own house, the testRenderer squats the runner flat.
    var testRenderer = {

        createPage: function createPage(type) {
            return $('<section></section>').addClass(type);
        },

        testPage: function rendertestPage(test, options, done) {
            var coverPageOptions = options && options.cover_page || {};
            var $content = $(pageTestTpl({
                title: coverPageOptions['title'] && test.title,
                subtitle: coverPageOptions['description'] && options.description,
                qrcode: coverPageOptions['qr_code'],
                logo: coverPageOptions['logo'] && options.logo,
                date: coverPageOptions['date'] && options.date
            }));

            if (coverPageOptions['qr_code']) {
                new QRCode($('.qr-code', $content).get(0), {
                    text:         urlHelper.route('render', 'PrintTest', 'taoBooklet', { uri :  test.uri}),
                    width:        192,
                    height:       192,
                    colorDark:    "#000000",
                    colorLight:   "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }

            done(null, $content);
        },

        sectionPage: function renderSectionPage(section, pageNum, done) {
            var $content = $(pageSectionTpl({
                title: section.title,
                rubricBlock: section.rubricBlock
            }));

            done(null, $content);
        },

        itemPage: function renderItemPage(item, uri, pageNum, assets,  done) {
            var $content = $(pageItemTpl());

            itemRunner('qtiprint', item)
                .on('error', function(err) {
                    done(err);
                })
                .on('render', function() {
                    done(null, $content);
                })
                .assets([
                    {
                        name: 'base64package',
                        handle: function handleBase64(url) {
                            var id = url.file;
                            var found = _.find(assets,  function (assetsList) {
                                var asset = assetsList[id];
                                return !!(asset && urlHelper.isBase64(asset));
                            });
                            if (found) {
                                return found[id];
                            }
                        }
                    },
                    assetStrategies.taomedia,
                    assetStrategies.external,
                    {
                        name: 'packageAssetHandler',
                        handle: function handleAssetFromPackage(url) {
                            for (var type in assets) {
                                if (assets[type][url.toString()]) {
                                    return assets[type][url.toString()];
                                }
                            }
                        }
                    }
                ], {
                    baseUrl : urlHelper.route('getFile', 'QtiCreator', 'taoQtiItem', {uri : uri, lang : 'en-US'}) + '&relPath='
                })
                .init()
                .render($content);
        }
    };

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
     * @returns {TestRunner}
     */
    var testRunnerFactory = function testRunnerFactory(testData, options) {
        var layoutOptions = options && options.layout || {};
        var testRunner = eventifier({

            /**
             * Test container
             * @type {jQueryElement}
             */
            $container: null,

            /**
             * Initialize the current item.
             *
             * @param {HTMLElement|jQueryElement} elt - the DOM element that is going to contain the rendered test.
             * @returns {TestRunner} to chain calls
             *
             * @fires TestRunner#ready
             * @fires TestRunner#render
             * @fires TestRunner#error if the elt isn't valid
             *
             * @fires TestRunner#statechange the provider is reponsible to trigger this event
             * @fires TestRunner#responsechange  the provider is reponsible to trigger this event
             */
            render: function(elt) {
                var self = this;
                var pageRenderers = [];

                //check elt
                if (!(elt instanceof HTMLElement) && !(elt instanceof $)) {
                    return self.trigger('error', 'A valid HTMLElement (or a jquery element) at least is required to render the test');
                }

                //we keep a reference to the container
                if (elt instanceof $) {
                    this.$container = elt;
                } else {
                    this.$container = $(elt);
                }

                //Build the pageRenderers array that contains each page to render

                //transform the function of the renderer to fit the format required by async (partial with data and binding)
                if (layoutOptions['cover_page']) {
                    pageRenderers.push(
                        _.bind(
                            _.partial(testRenderer.testPage, testData.data, options),
                            testRenderer
                        )
                    );
                }

                _.forEach(testData.data.testParts, function(testPart) {
                    _.forEach(testPart.sections, function(section) {

                        pageRenderers.push(
                            _.bind(
                                _.partial(testRenderer.sectionPage, section, pageRenderers.length),
                                testRenderer
                            )
                        );

                        _.forEach(section.items, function(item) {
                            //
                            if (testData.items[item.href] && testData.items[item.href].data) {
                                //transform the function of the renderer to fit the format required by async (partial with data and binding)
                                pageRenderers.push(
                                    _.bind(
                                        _.partial(testRenderer.itemPage, testData.items[item.href].data, item.href, pageRenderers.length, testData.items[item.href].assets),
                                        testRenderer
                                   )
                                );
                            }
                        });
                    });
                });

                //then we call all the renderers in parallel
                asyncLib.parallel(pageRenderers, function renderingDone(err, $results) {
                    if (err) {
                        self.trigger('error', 'An error occurred while rendering a page :  ' + err);
                    }

                    //dummy rtl support from options
                    if(options && options.rtl === true){
                        self.$container.addClass('rtl').attr('dir', 'rtl');
                    }

                    //once they are all done, we insert the content to the container
                    self.$container.empty().append($results);


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
             * Clear the running test.
             * @returns {TestRunner}
             *
             * @fires TestRunner#clear
             */
            clear: function() {

                this.$container.empty();

                /**
                 * The test is ready.
                 * @event TestRunner#clear
                 */
                this.trigger('clear');

                return this;
            }
        });

        testData = testData || {};

        if (!testData || !testData.data || !testData.items) {
            throw new Error('Invalid test data structure');
        }

        return testRunner;
    };

    return testRunnerFactory;
});


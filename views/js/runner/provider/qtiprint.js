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
 * Copyright (c) 2014-2017 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 */

/**
 * Item Runner for printed items
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'lodash',
    'i18n',
    'context',
    'core/logger',
    'core/promise',
    'taoQtiItem/qtiItem/core/Loader',
    'taoQtiItem/qtiItem/core/Element',
    'taoQtiItem/qtiRunner/core/Renderer',
    'taoQtiItem/runner/provider/manager/picManager',
    'taoQtiItem/runner/provider/manager/userModules',
    'tpl!taoQtiPrint/qtiPrintRenderer/tpl/notYetSupported'
], function (_, __, context, loggerFactory, Promise, QtiLoader, Element, Renderer, picManager, userModules, notYetSupportedTpl) {
    'use strict';

    var timeout = (context.timeout > 0 ? context.timeout + 1 : 30) * 1000;

    var logger = loggerFactory('runner/provider/qtiPrint');

    /**
     * List the renderer's modules
     * @type Object
     */
    var rendererModules = {
        results: ['taoQtiPrint/qtiCommonRenderer/renderers/config', 'css!taoQtiPrintCss/themes/items/default/theme.css'],
        booklet: ['taoQtiPrint/qtiPrintRenderer/renderers/config', 'css!taoQtiPrintCss/qti.css']
    };

    /**
     * The promise that resolves the chosen renderer
     * @type {Promise}
     */
    var QtiRendererPromise = null;

    /**
     * Gets a promise that will resolve the chosen renderer
     * @param {String} rendererType The name of the renderer to resolve
     * @returns {Promise}
     */
    function getQtiRenderer(rendererType) {
        if (!QtiRendererPromise) {
            QtiRendererPromise = new Promise(function (resolve) {
                require(rendererModules[rendererType], function (config) {
                    resolve(Renderer.build(config.locations, config.name, config.options));
                });
            }).catch(function (err) {
                logger.error(err);
            });
        }
        return QtiRendererPromise;
    }

    /**
     * Gets a block that displays information about unsupported content
     * @param {Object} item
     * @param {Object} additional
     * @returns {String}
     */
    function missingSupport(item, additional) {
        var label = item.identifier;
        if (item.attributes && item.attributes.label) {
            label = item.attributes.label;
        }
        return notYetSupportedTpl({
            message: __("The item &laquo;%s&raquo; contains an interaction that is not yet supported for printing purpose", label),
            additional: additional
        });
    }

    /**
     * @exports taoQtiPrint/runner/provider/qtiprint
     */
    return {
        /**
         *
         * @param {Object} itemData
         * @param {Function} done
         */
        init: function init(itemData, done) {
            var self = this;

            getQtiRenderer(self.options.renderer).then(function (QtiRenderer) {
                var rendererOptions = {
                    assetManager: self.assetManager
                };

                if (self.options.themes) {
                    rendererOptions.themes = self.options.themes;
                }

                self._loader = new QtiLoader();
                self._renderer = new QtiRenderer(rendererOptions);

                self._loader.loadItemData(itemData, function (item) {
                    if (!item) {
                        return self.trigger('error', 'Unable to load item from the given data.');
                    }

                    self._itemData = itemData;
                    self._item = item;
                    try {
                        self._renderer.load(function () {
                            self._item.setRenderer(this);

                            done();
                        }, this.getLoadedClasses());
                    } catch (e) {
                        self.trigger('error', 'Unable to render the item : ' + e);
                    }
                });
            });
        },

        /**
         *
         * @param {HTMLElement} elt
         * @param {Function} done
         */
        render: function render(elt, done) {
            var self = this;
            if (this._item) {
                try {
                    elt.innerHTML = this._item.render({});
                } catch (e) {
                    logger.trace(e);
                    elt.innerHTML = missingSupport(this._itemData, e);
                    self.trigger('warning', 'Error in template rendering : ' + e);
                }
                try {
                    // Race between postRendering and timeout
                    // postRendering waits for everything to be resolved or one reject
                    Promise
                        .race([
                            Promise.all(this._item.postRender()),
                            new Promise(function (resolve, reject) {
                                _.delay(reject, timeout, new Error('Post rendering ran out of time in item ' + self._itemData.serial));
                            })
                        ])
                        .then(function () {
                            /**
                             * Lists the PIC provided by this item.
                             * @event qti#listpic
                             */
                            self.trigger('listpic', picManager.collection(self._item));

                            return userModules.load().then(done);
                        })
                        .catch(function (err) {
                            self.trigger('error', 'Error in post rendering : ' + err instanceof Error ? err.message : err);
                            done();
                        });

                } catch (e) {
                    self.trigger('error', 'Error in post rendering : ' + e);
                    done();
                }
            } else {
                done();
            }
        },

        /**
         *
         * @param {HTMLElement} elt
         * @param {Function} done
         */
        clear: function clear(elt, done) {
            done();
        },

        /**
         *
         * @returns {Object}
         */
        getState: function getState() {
            return {};
        },

        /**
         *
         * @param {Object} state
         */
        setState: function setState(state) {
            if (this._item && state) {

                //set interaction state
                _.forEach(this._item.getInteractions(), function (interaction) {
                    var id = interaction.attr('responseIdentifier');
                    if (id && state[id]) {
                        interaction.setState(state[id]);
                    }
                });

                //set info control state
                if (state.pic) {
                    _.forEach(this._item.getElements(), function (element) {
                        if (Element.isA(element, 'infoControl') && state.pic[element.attr('id')]) {
                            element.setState(state.pic[element.attr('id')]);
                        }
                    });
                }
            }
        },

        /**
         *
         * @returns {Array}
         */
        getResponses: function getResponses() {
            return [];
        }
    };
});

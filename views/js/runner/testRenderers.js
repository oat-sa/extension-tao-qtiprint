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
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 * @author Jean-Sébastien Conan <jean-sebastien@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'util/url',
    'taoQtiPrint/runner/itemRunner',
    'taoItems/assets/strategies',
    'taoQtiPrint/lib/qrcode',
    'tpl!taoQtiPrint/runner/tpl/pageTest',
    'tpl!taoQtiPrint/runner/tpl/pageSection',
    'tpl!taoQtiPrint/runner/tpl/pageBlock'
], function ($,
             _,
             urlHelper,
             itemRunner,
             assetStrategies,
             QRCode,
             pageTestTpl,
             pageSectionTpl) {
    'use strict';

    /**
     * Defines renderers for each blocks in the printed test
     * @typedef {testRenderers}
     */
    return {

        /**
         * Renders a block that represents a cover page
         * @param {jQuery} $container - The container in which renders the block
         * @param {Object} test - The test definition
         * @param {Object} options - The print options
         * @param {Function} done - A callback to call when the block is fully rendered
         */
        testPage: function testPage($container, test, options, done) {
            var coverPageOptions = options && options.cover_page || {};

            $(pageTestTpl({
                title: coverPageOptions['title'] && test.title,
                subtitle: coverPageOptions['description'] && options.description,
                qrcode: coverPageOptions['qr_code'],
                logo: coverPageOptions['logo'] && options.logo,
                date: coverPageOptions['date'] && options.date,
                uniqid: coverPageOptions['unique_id'] && options.unique_id
            })).appendTo($container);

            if (coverPageOptions['qr_code']) {
                new QRCode($('.qr-code', $container).get(0), {
                    text: coverPageOptions['qr_code_data'] || urlHelper.route('render', 'PrintTest', 'taoBooklet', {uri: options.uri}),
                    width: 192,
                    height: 192,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }

            done();
        },

        /**
         * Renders a block that represents a section of the test
         * @param {jQuery} $container - The container in which renders the block
         * @param {Object} section - The section definition
         * @param {Function} done - A callback to call when the block is fully rendered
         */
        sectionPage: function sectionPage($container, section, done) {

            $(pageSectionTpl({
                title: section.title,
                rubricBlock: section.rubricBlock
            })).appendTo($container);

            done();
        },

        /**
         * Renders a block that represents an item of the test
         * @param {jQuery} $container - The container in which renders the block
         * @param {Object} itemRef - The item definition
         * @param {Object} itemState - The responses of the item
         * @param {String} uri - The URI of the item
         * @param {Function} done - A callback to call when the block is fully rendered
         */
        itemPage: function itemPage($container, itemRef, itemState, uri, done) {
            var item = itemRef.data;
            var assets = itemRef.assets;
            var baseUrl = itemRef.baseUrl || urlHelper.route('getFile', 'QtiCreator', 'taoQtiItem', {
                uri: uri,
                lang: 'en-US'
            }) + '&relPath=';
            var isDone = false;

            /**
             * @param [err]
             */
            function itemDone(err) {
                if (!isDone) {
                    isDone = true;
                    done(err);
                }
            }

            itemRunner('qtiprint', item, {renderer: itemRef.renderer})
                .on('error', function (err) {
                    itemDone(err);
                })
                .on('init', function () {
                    if (itemState && _.isPlainObject(itemState)) {
                        this.setState(itemState);
                    }
                    this.render($container);
                })
                .on('ready', function () {
                    itemDone();
                })
                .assets([
                    {
                        name: 'base64package',
                        handle: function handleBase64(url) {
                            var id = url.file;
                            var found = _.find(assets, function (assetsList) {
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
                    assetStrategies.baseUrl
                ], {
                    baseUrl: baseUrl
                })
                .init();
        }
    };
});


/**
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
 * Copyright (c) 2019 (original work) Open Assessment Technologies SA;
 */

/**
 * Configure the extension bundles
 */
module.exports = function (grunt) {
    'use strict';

    grunt.config.merge({
        bundle: {
            taoqtiprint: {
                options: {
                    extension: 'taoQtiPrint',
                    outputDir: 'loader',
                    dependencies: ['taoItems', 'taoQtiItem'],
                    bundles: [
                        {
                            name: 'taoQtiPrint',
                            babel: true,
                            include: [
                                'taoQtiPrint/lib/**/*',
                                'taoQtiPrint/qtiCommonRenderer/**/*',
                                'taoQtiPrint/qtiPrintRenderer/**/*',
                                'taoQtiPrint/runner/**/*'
                            ]
                        },
                        {
                            name: 'taoQtiPrint.es5',
                            babel: true,
                            targets: {
                                ie: '11'
                            },
                            dependencies: [
                                'taoItems/loader/taoItemsRunner.es5.min',
                                'taoQtiItem/loader/taoQtiItemRunner.es5.min'
                            ],
                            include: [
                                'taoQtiPrint/lib/**/*',
                                'taoQtiPrint/qtiCommonRenderer/**/*',
                                'taoQtiPrint/qtiPrintRenderer/**/*',
                                'taoQtiPrint/runner/**/*'
                            ]
                        }
                    ]
                }
            }
        }
    });

    // bundle task
    grunt.registerTask('taoqtiprintbundle', ['bundle:taoqtiprint']);
};

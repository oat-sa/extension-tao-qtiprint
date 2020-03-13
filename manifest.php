<?php

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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA;
 *
 *
 */

return [
    'name' => 'taoQtiPrint',
    'label' => 'qti',
    'description' => 'Provides printable rendering for QTI Items',
    'license' => 'GPL-2.0',
    'version' => '1.9.1',
    'author' => 'Open Assessment Technologies SA',
    'requires' => [
        'tao' => '>=30.0.0',
        'taoQtiItem' => '>=8.4.8',
        'taoQtiTest' => '>=10.14.0'
    ],
    // for compatibility
    'dependencies' => ['tao','taoQtiItem'],
    'managementRole' => 'http://www.tao.lu/Ontologies/generis.rdf#taoQtiPrintManager',
    'acl' => [
        ['grant', 'http://www.tao.lu/Ontologies/generis.rdf#taoQtiPrintManager', ['ext' => 'taoQtiPrint']],
    ],
    'uninstall' => [
    ],
    'install' => [
    ],
    'update' => 'oat\\taoQtiPrint\\scripts\\update\\Updater',
    'autoload' =>  [
        'psr-4' => [
            'oat\\taoQtiPrint\\' => dirname(__FILE__) . DIRECTORY_SEPARATOR
        ]
    ],
    'routes' => [
        '/taoQtiPrint' => 'oat\\taoQtiPrint\\controller'
    ],
    'constants' => [
        # views directory
        "DIR_VIEWS" => dirname(__FILE__) . DIRECTORY_SEPARATOR . "views" . DIRECTORY_SEPARATOR,

        #BASE URL (usually the domain root)
        'BASE_URL' => ROOT_URL . 'taoQtiPrint/',
    ]
];

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

return array(
    'name' => 'taoQtiItemPrint',
	'label' => 'qti',
	'description' => 'Provides printable rendering for QTI Items',
    'license' => 'GPL-2.0',
    'version' => '0.1.0',
	'author' => 'Open Assessment Technologies SA',
	'requires' => array('tao' => '>=2.7.10','taoQtiItem' => '>=2.7.4'),
	// for compatibility
	'dependencies' => array('tao','taoQtiItem'),
	'managementRole' => 'http://www.tao.lu/Ontologies/generis.rdf#taoQtiItemPrintManager',
    'acl' => array(
        array('grant', 'http://www.tao.lu/Ontologies/generis.rdf#taoQtiItemPrintManager', array('ext'=>'taoQtiItemPrint')),
    ),
    'uninstall' => array(
    ),
    'autoload' => array (
        'psr-4' => array(
            'oat\\taoQtiItemPrint\\' => dirname(__FILE__).DIRECTORY_SEPARATOR
        )
    ),
    'routes' => array(
        '/taoQtiItemPrint' => 'oat\\taoQtiItemPrint\\controller'
    ),
	'constants' => array(
	    # views directory
	    "DIR_VIEWS" => dirname(__FILE__).DIRECTORY_SEPARATOR."views".DIRECTORY_SEPARATOR,

		#BASE URL (usually the domain root)
		'BASE_URL' => ROOT_URL.'taoQtiItemPrint/',

	    #BASE WWW required by JS
	    'BASE_WWW' => ROOT_URL.'taoQtiItemPrint/views/'
	)
);

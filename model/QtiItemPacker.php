<?php
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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 */

namespace oat\taoQtiPrint\model;

use oat\taoItems\model\media\ItemMediaResolver;
use oat\taoQtiItem\model\pack\QtiItemPacker as ItemPacker;

/**
 * This class pack a QTI Item. Packing instead of compiling, aims
 * to extract the only data of an item. Those data are used by the
 * item runner to render the item.
 *
 * Class QtiItemPacker
 * @package oat\taoQtiPrint\model
 * @author Jean-Sebastien CONAN <jean-sebastien@taotesting.com>
 */
class QtiItemPacker extends ItemPacker
{
    /**
     * @param string[] $assets
     * @param ItemMediaResolver $resolver
     * @return string[]
     */
    protected function resolveAsset($assets, ItemMediaResolver $resolver)
    {
        foreach ($assets as &$asset) {
            $asset = $resolver->resolve($asset)->getMediaIdentifier();
        }
        return $assets;
    }
}

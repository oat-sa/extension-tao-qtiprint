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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 */

namespace oat\taoQtiPrint\scripts\update;

use oat\taoQtiPrint\model\DeliveryExecutionPacker;
use oat\taoQtiPrint\model\DeliveryPacker;

/**
 * Class Updater
 * @package oat\taoQtiPrint\scripts\update
 */
class Updater extends \common_ext_ExtensionUpdater
{
    /**
     *
     * @param string $initialVersion
     * @return string $versionUpdatedTo
     */
    public function update($initialVersion) {

        $this->skip('0.1.0', '1.3.1');

        if ($this->isVersion('1.3.1')) {
            $this->getServiceManager()->register(DeliveryPacker::SERVICE_ID, new DeliveryPacker());
            $this->getServiceManager()->register(DeliveryExecutionPacker::SERVICE_ID, new DeliveryExecutionPacker());
            $this->setVersion('1.4.0');
        }
        $this->skip('1.4.0', '1.6.0');

    }
}

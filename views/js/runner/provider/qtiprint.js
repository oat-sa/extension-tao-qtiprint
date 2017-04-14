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
 * Copyright (c) 2014 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * Item Runner for printed items
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'i18n',
    'helpers',
    'core/logger',
    'taoQtiItem/qtiItem/core/Loader',
    'taoQtiPrint/qtiPrintRenderer/renderers/Renderer',
    'tpl!taoQtiPrint/qtiPrintRenderer/tpl/notYetSupported'],
function(__, helpers, loggerFactory, QtiLoader, QtiRenderer, notYetSupportedTpl){
    'use strict';

    var logger = loggerFactory('runner/provider/qtiPrint');

    /**
     * @exports taoQtiPrint/runner/provider/qtiprint
     */
    var qtiItemRuntimeProvider = {

        init : function init (itemData, done){
            var self = this;

            this._renderer = new QtiRenderer({
                assetManager : this.assetManager
            });

            new QtiLoader().loadItemData(itemData, function(item){
                if(!item){
                    return self.trigger('error', 'Unable to load item from the given data.');
                }

                self._itemData = itemData;
                self._item = item;
                try{
                    self._renderer.load(function(){
                        self._item.setRenderer(this);

                        done();
                    }, this.getLoadedClasses());
                } catch(e){
                    self.trigger('error', 'Unable to render the item : ' + e);
                }
            });

        },

        render : function render (elt, done){
            var self = this;
            if(this._item){
                try {
                    elt.innerHTML = this._item.render({});
                } catch(e){
                    logger.trace(e);
                    elt.innerHTML = missingSupport(this._itemData, e);
                    self.trigger('warning', 'Error in template rendering : ' +  e);
                }
                try {
                    this._item.postRender();
                } catch(e){
                    logger.error(e);
                    self.trigger('error', 'Error in post rendering : ' +  e);
                }
                done();
            }
        },

        clear : function clear (elt, done){
            done();
        },

        getState : function getState (){
            return {};
        },

        setState : function setState (state){ },

        getResponses : function getResponses (){
            return [];
        }
    };

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

    return qtiItemRuntimeProvider;
});

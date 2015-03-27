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
    'taoQtiPrint/runner/itemRunner'
], function($, _, async, itemRunner){
    'use strict';

     /**
     *
     * Builds a brand new {@link TestRunner}.
     *
     * <strong>The factory is an internal mechanism to create encapsulated contexts.
     *  I suggest you to use directly the name <i>testRunner</i> when you require this module.</strong>
     *
     * @example require(['testRunner'], function(testRunner){
                    testRunner({testId : 12})
     *                    .on('statechange', function(state){
     *
     *                    })
     *                    .on('ready', function(){
     *
     *                    })
     *                    .on('response', function(){
     *
     *                    })
     *                   .init()
     *                   .render($('.test-container'));
     *          });
     *
     * @exports testRunner
     * @namespace testRunnerFactory
     *
     * @param {String} [providerName] - the name of a provider previously registered see {@link testRunnerFactory#register}
     * @param {Object} [data] - the data of the test to run
     *
     * @returns {TestRunner}
     */
    var testRunnerFactory = function testRunnerFactory(data, options){


        data = data || {};

        if(!data || !data.data || !_.isArray(data.items)){
            throw new Error('Invalid test data structure');
        }

        //contains the bound events.
        var events = {};

        var testRunner = {

            /**
             * Test container
             * @type {jQueryElement}
             */
            $container : null,

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
           render : function(elt){
                var self = this;

                //check elt
                if( !(elt instanceof HTMLElement) && !(elt instanceof $) ){
                    return self.trigger('error', 'A valid HTMLElement (or a jquery element) at least is required to render the test');
                }

                //we keep a reference to the container
                if(elt instanceof $){
                    this.$container = elt;
                } else {
                    this.$container = $(elt);
                }


                var itemRunners = [];

                _.forEach(data.items, function(itemData){

                    var runItem = function runItem(done){
                        var $itemContainer = $('<div style="page-break-after: always;"></div');

                        itemRunner('qtiprint', itemData.data)
                            .on('error', function(err){
                                done(err);
                            })
                            .on('render', function(){
                                done(null, $itemContainer);
                            })
                            .init()
                            .render($itemContainer);
                    };
                    itemRunners.push(runItem);
                });

                async.parallel(itemRunners, function itemDone(err, results){
                    if(err){
                        self.trigger('error', 'Unable to render items :  ' + err);
                    }
                    self.$container.empty().append(results);
                });


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

                return this;
           },

           /**
            * Clear the running test.
            * @returns {TestRunner}
            *
            * @fires TestRunner#clear
            */
           clear : function(){

                this.$container.empty();

                /**
                 * The test is ready.
                 * @event TestRunner#clear
                 */
                this.trigger('clear');

                return this;
           },
           /**
            * Attach an event handler.
            * Calling `on` with the same eventName multiple times add callbacks: they
            * will all be executed.
            *
            * @example testRunner()
            *               .on('statechange', function(state){
            *                   //state === this.getState()
            *               });
            *
            * @param {String} name - the name of the event to listen
            * @param {Function} handler - the callback to run once the event is triggered. It's executed with the current testRunner context (ie. this
            * @returns {TestRunner}
            */
            on : function(name, handler){
                if(_.isString(name) && _.isFunction(handler)){
                    events[name] = events[name] || [];
                    events[name].push(handler);
                }
                return this;
            },

            /**
            * Remove handlers for an event.
            *
            * @example testRunner().off('statechange');
            *
            * @param {String} name - the event name
            * @returns {TestRunner}
            */
            off : function(name){
                if(_.isString(name)){
                    events[name] = [];
                }
                return this;
            },

            /**
            * Trigger an event manually.
            *
            * @example testRunner().trigger('statechange', new State());
            *
            * @param {String} name - the name of the event to trigger
            * @param {*} data - arguments given to the handlers
            * @returns {TestRunner}
            */
            trigger : function(name, data){
                var self = this;
                if(_.isString(name) && _.isArray(events[name])){
                    _.forEach(events[name], function(event){
                        event.call(self, data);
                    });
                }
                return this;
            }
        };
    };

    return testRunnerFactory;
});

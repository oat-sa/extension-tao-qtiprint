define([
    'jquery',
    'lodash',
    'taoItems/runner/api/itemRunner',
    'taoQtiPrint/runner/provider/qtiprint',
    'json!taoQtiPrint/test/samples/space-shuttle.json'
], function($, _, itemRunner, qtiRuntimeProvider, itemData){

    var containerId = 'item-container';


    QUnit.module('Provider API');

    QUnit.test('module', function(assert){
        assert.ok(typeof qtiRuntimeProvider !== 'undefined', "The module exports something");
        assert.ok(typeof qtiRuntimeProvider === 'object', "The module exports an object");
        assert.ok(typeof qtiRuntimeProvider.init === 'function' || typeof qtiRuntimeProvider.render === 'function', "The provider expose an init or a render method");
    });



    QUnit.module('Register the provider', {
        teardown : function(){
            //reset the provider
            itemRunner.providers = undefined;
        }
    });

    QUnit.test('register the qti provider', function(assert){
        QUnit.expect(4);

        assert.ok(typeof itemRunner.providers === 'undefined', 'the runner has no providers');

        itemRunner.register('qtiprint', qtiRuntimeProvider);

        assert.ok(typeof itemRunner.providers === 'object', 'the runner has now providers');
        assert.ok(typeof itemRunner.providers.qtiprint === 'object', 'the runner has now the qtiprint providers');
        assert.equal(itemRunner.providers.qtiprint, qtiRuntimeProvider, 'the runner has now the qtiprint providers');

    });



    QUnit.module('Provider init', {
        teardown : function(){
            //reset the provides
            itemRunner.providers = undefined;
        }
    });

    QUnit.asyncTest('Item data loading', function(assert){
        QUnit.expect(2);

        itemRunner.register('qtiprint', qtiRuntimeProvider);


        itemRunner('qtiprint', itemData)
          .on('init', function(){

            assert.ok(typeof this._item === 'object', 'The item data is loaded and mapped to an object');
            assert.ok(typeof this._item.bdy === 'object', 'The item contains a body object');

            QUnit.start();
          }).init();
    });

    QUnit.asyncTest('Loading wrong data', function(assert){
        QUnit.expect(2);

        itemRunner.register('qtiprint', qtiRuntimeProvider);

        itemRunner('qtiprint', { foo : true})
          .on('error', function(message){

            assert.ok(true, 'The provider triggers an error event');
            assert.ok(typeof message === 'string', 'The error is a string');

            QUnit.start();
          }).init();
    });


    QUnit.module('Provider render', {
        teardown : function(){
            //reset the provides
            itemRunner.providers = undefined;
        }
    });

    QUnit.asyncTest('Item rendering', function(assert){
        QUnit.expect(3);

        var $container = $('#' + containerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        itemRunner.register('qtiprint', qtiRuntimeProvider);

        itemRunner('qtiprint', itemData)
            .on('render', function(){

                assert.equal($container.children().length, 1, 'the container has children');

                QUnit.start();
            })
            .init()
            .render($container);
    });

});


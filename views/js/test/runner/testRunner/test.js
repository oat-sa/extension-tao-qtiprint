define([
    'jquery',
    'taoQtiPrint/runner/testRunner',
    'json!taoQtiPrint/test/samples/test.json'
], function($, testRunner, testData){

    var container = 'outside-container';

    QUnit.module('Runner API');

    QUnit.test('module', function(assert){
        assert.ok(typeof testRunner !== 'undefined', "The module exports something");
        assert.ok(typeof testRunner === 'function', "The module exports a function");
    });


    QUnit.module('Render');

    QUnit.asyncTest('module', function(assert){
        QUnit.expect(1);

        testRunner(testData)
            .on('error', function(e){

            })
            .on('ready', function(){

                assert.ok(true);
                console.log('timeout');
                QUnit.start();
            })
            .render($('.' + container));
    });
});


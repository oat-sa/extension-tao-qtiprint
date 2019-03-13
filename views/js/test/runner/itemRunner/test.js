define(['taoQtiPrint/runner/itemRunner'], function(itemRunner) {

    QUnit.module('Runner API');

    QUnit.test('module', function(assert) {
        assert.ok(typeof itemRunner !== 'undefined', 'The module exports something');
        assert.ok(typeof itemRunner === 'function', 'The module exports a function');
    });

    QUnit.module('QTI Provider');

    QUnit.test('provider registered', function(assert) {
        assert.ok(typeof itemRunner.providers !== 'undefined', 'The runner has providers');
        assert.ok(typeof itemRunner.providers.qtiprint !== 'undefined', 'The runner has a QTI provider');
    });

});


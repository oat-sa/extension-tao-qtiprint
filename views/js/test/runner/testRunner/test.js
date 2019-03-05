define( [
    
    'jquery',
    'taoQtiPrint/runner/testRunner',
    'json!taoQtiPrint/test/samples/test.json'
], function(  $, testRunner, testData ) {

    var container = 'container';

    QUnit.module( 'Runner API' );

    QUnit.test( 'module', function( assert ) {
        assert.ok( typeof testRunner !== 'undefined', 'The module exports something' );
        assert.ok( typeof testRunner === 'function', 'The module exports a function' );
    } );

    QUnit.test( 'data validation', function( assert ) {

        assert.throws( function() {
            testRunner( null );
        }, Error, 'The test runner should be initialized with data' );

        assert.throws( function() {
            testRunner( {} );
        }, Error, 'The test runner should be initialized with valid' );

        assert.throws( function() {
            testRunner( { data: {} } );
        }, Error, 'The test runner should be initialized with items' );

        assert.ok( typeof testRunner( { data: {}, items: {} } ) === 'object', 'The test runner creates an object' );
    } );

    QUnit.module( 'Render' );

    QUnit.test( 'renders a test', function( assert ) {
        var ready = assert.async();
        assert.expect( 2 );

        var $container = $( '.' + container );

        assert.equal( $container.length, 1, 'The container exists' );

        testRunner( testData )
            .on( 'error', function( e ) {
                assert.ok( false, 'The test runner has failed :' + e );
            } )
            .on( 'ready', function() {
                assert.equal( $container.children().length, 3, 'The container contains now 3 pages' );
                ready();
            } )
            .render( $container );
    } );
} );


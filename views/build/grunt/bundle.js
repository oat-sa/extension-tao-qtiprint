module.exports = function(grunt) {

    var requirejs   = grunt.config('requirejs') || {};

    var root        = grunt.option('root');
    var libs        = grunt.option('mainlibs');
    var ext         = require(root + '/tao/views/build/tasks/helpers/extensions')(grunt, root);
    var out         = 'output';

    /**
     * Resolve AMD modules in the current extension
     */
    var qtiCore = ext.getExtensionSources('taoQtiItem', ['views/js/qtiItem/core/**/*.js'], true);
    var qtiPrintLibs = ext.getExtensionSources('taoQtiItemPrint', ['views/js/qtiPrintRenderer/**/*.js'], true);


    /**
     * Compile the new item runner as a standalone library
     */
    requirejs.qtiprintrunner = {
        options: {
            baseUrl : '../js',
            mainConfigFile : './config/requirejs.build.js',
            findNestedDependencies : true,
            uglify2: {
                mangle : false,
                output: {
                    'max_line_len': 400
                }
            },
            wrap : {
                start : '',
                end : "define(['taoQtiItemPrint/runner/qtiItemPrintRunner'], function(runner){ return runner; });"
            },
            wrapShim: true,
            inlineCss : true,
            paths : {
                'taoQtiItem':         root + '/taoQtiItem/views/js',
                'taoQtiItemPrint':    root + '/taoQtiItemPrint/views/js',
                'taoQtiItemPrintCss': root + '/taoQtiItemPrint/views/css',
                'taoItems':           root + '/taoItems/views/js'
            },
            excludeShallow : ['mathJax', 'mediaElement', 'ckeditor'],
            include: qtiCore.concat(qtiPrintLibs).concat([ 'tpl', 'json']),
            name: "taoQtiItemPrint/runner/qtiItemPrintRunner",
            out: out + "/qtiItemPrintRunner.min.js"
        }
    };


    grunt.config('requirejs', requirejs);

    // bundle task
    grunt.registerTask('taoqtiitemprintbundle', ['requirejs:qtiprintrunner']);

};

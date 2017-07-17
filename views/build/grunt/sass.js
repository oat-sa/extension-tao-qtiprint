module.exports = function (grunt) {
    'use strict';

    var sass    = grunt.config('sass') || {};
    var watch   = grunt.config('watch') || {};
    var notify  = grunt.config('notify') || {};
    var root    = grunt.option('root') + '/taoQtiPrint/views/';

    //override load path
    sass.taoqtiprint = {
        options : {},
        files : {}
    };

    //files goes heres
    sass.taoqtiprint.files[root + 'css/qti.css'] = root + 'scss/qti.scss';


    watch.taoqtiprintsass = {
        files : [root + 'scss/**/*.scss'],
        tasks : ['sass:taoqtiprint', 'notify:taoqtiprintsass'],
        options : {
            debounceDelay : 1000
        }
    };

    notify.taoqtiprintsass = {
        options: {
            title: 'Grunt SASS',
            message: 'SASS files compiled to CSS'
        }
    };

    grunt.config('sass', sass);
    grunt.config('watch', watch);
    grunt.config('notify', notify);

    //register an alias for main build
    grunt.registerTask('taoqtiprintsass', ['sass:taoqtiprint']);
};

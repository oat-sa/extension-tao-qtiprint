module.exports = function(grunt) {

    var sass    = grunt.config('sass') || {};
    var watch   = grunt.config('watch') || {};
    var notify  = grunt.config('notify') || {};
    var root    = grunt.option('root') + '/taoQtiItemPrint/views/';

    //override load path
    sass.taoqtiitemprint = {
        options : {
            loadPath : ['../scss/', '../js/lib/', root + 'scss/inc', root + 'scss/qti']
        },
        files : {}
    };

    //files goes heres
    sass.taoqtiitemprint.files[root + 'css/qti.css'] = root + 'scss/qti.scss';


    watch.taoqtiitemprintsass = {
        files : [root + 'scss/**/*.scss'],
        tasks : ['sass:taoqtiitemprint', 'notify:taoqtiitemprintsass'],
        options : {
            debounceDelay : 1000
        }
    };

    notify.taoqtiitemprintsass = {
        options: {
            title: 'Grunt SASS',
            message: 'SASS files compiled to CSS'
        }
    };

    grunt.config('sass', sass);
    grunt.config('watch', watch);
    grunt.config('notify', notify);

    //register an alias for main build
    grunt.registerTask('taoqtiitemprintsass', ['sass:taoqtiitemprint']);
};

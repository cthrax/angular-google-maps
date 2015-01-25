var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var karma = require('karma').server;

var src = {
    coffeescript: [
        'src/core/coffee/*.coffee',
        'src/features/**/coffee/*.coffee'
    ]
};

var dev = false;

// If a dev task is going to be run, then set the dev flag
gulp.on('start', function(e) {
    if(e.message.indexOf('-dev') !== -1) {
        dev = true;
    }
});

gulp.task('lint', function() {
    gulp.src(src.coffeescript)
        .pipe(plugins.coffeelint())
        .pipe(plugins.coffeelint.reporter()) // Stylish reporter
        .pipe(plugins.coffeelint.reporter('failOnWarning')); // Fail the build on warning or above
});

gulp.task('build', function() {
    var files = [
        'bower_components/uuid/src/uuid.core.js',
        'lib/uuid.core.js',
        'src/util/core/**',
        'src/core/templates/*.html',
        'src/features/**/templates/*.html'
    ];
    src.coffeescript.map(function(path) {files.push(path);});

    return gulp.src(files)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.if(/[.]coffee$/, plugins.coffee()))
        .pipe(plugins.if(/[.]html$/, plugins.html2js({
            base: 'src/',
            outputModuleName: 'ui-gmap.templates',
            useStrict: true
        })))
        .pipe(plugins.concat("angular-google-maps.js"))
        // Using ngAnnotated removes the need for array syntax on DI functions
        .pipe(plugins.ngAnnotate())
        .pipe(dev === false ? plugins.uglifyjs() : plugins.util.noop())
        .pipe(plugins.sourcemaps.write('maps', {
            includeContent: true
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('build-dev', ['build']);

gulp.task("watch-dev", function() {
    gulp.watch('src/**', ['build-dev']);
});

gulp.task('spec', function(done) {
    karma.start({
        configFile: process.cwd() + '/spec/unit/karma.conf.js',
        singleRun: true,
        debug: true,
        logLevel: "DEBUG"
    }, done);
});

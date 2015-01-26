module.exports = function (config) {
    config.set({
        basePath: '../../',
        frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai', 'chai-things'],
        files: [
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/uuid/dist/uuid.core.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-route/angular-route.js',
            'lib/uuid.core.js',
            'src/**/templates/*.html',
            'src/util/**/*.coffee',
            'src/core/coffee/**/*.coffee',
            'src/features/**/coffee/*.coffee',
            'src/**/*.spec.coffee'
        ],
        autoWatch: false,
        singleRun: true,
        reporters: ['spec', 'coverage'],
        preprocessors: {
            'src/**/templates/*.html': ['ng-html2js'],
            'src/util/**/*.coffee': ['coverage'],
            'src/**/coffee/*.coffee': ['coverage'],
            'src/**/*.spec.coffee': ['coffee']
        },

        client: {
            captureConsole: true
        },

        coffeePreprocessor: {
            // options passed to the coffee compiler
            options: {
                bare: true,
                sourceMap: true
            },
            // transforming the filenames
            transformPath: function(path) {
                return path.replace(/\.coffee$/, '.js');
            }
        },
        ngHtml2JsPreprocessor: {
            cacheIdFromPath: function(filepath) {
                // Use this to modify templateUrl in generated templates
                return filepath;
            },
            moduleName: 'ui-gmap.templates'
        },
        debug: true,
        logLevel: "DEBUG",
        coverageReporter: {
            type: 'html',
            dir: 'build/coverage'
        },
        browsers: ['PhantomJS'],
        plugins: [
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-chai-plugins',
            'karma-sinon-chai',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-ng-html2js-preprocessor',
            'karma-spec-reporter',
            'karma-coffee-preprocessor'
        ]
    });
};

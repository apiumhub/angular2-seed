module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine', 'chai', 'sinon', 'browserify'],

        files: [
            {pattern: 'node_modules/systemjs/dist/system-polyfills.js', instrument: false},
            {pattern: 'node_modules/systemjs/dist/system.js', instrument: false},
            {pattern: 'node_modules/rxjs/bundles/Rx.js', included: true, watched: true},
            {pattern: 'app/**/hero.ts', included: true, watched: false},
            {pattern: 'tests/**/*.ts', included: true, watched: false}
        ],

        preprocessors: {
            './**/*.ts': [
                'typescript'
            ],
            '**/*.js': ['browserify']
        },

        tscPreprocessor: {
            tsConfig: 'tsconfig.json' // relative to __dirname path
        },

        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            '/src/': '/base/src/'
        },

        port: 9876,

        logLevel: config.LOG_INFO,

        colors: true,

        autoWatch: true,

        browsers: ['PhantomJS'],

        // Karma plugins loaded
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-tsc-preprocessor',
            'karma-typescript-preprocessor',
            'karma-phantomjs-launcher',
            'karma-browserify',
            'karma-jasmine',
            'karma-coverage',
            'karma-chrome-launcher'
        ],

        // Coverage reporter generates the coverage
        reporters: ['progress', 'dots'],

        coverageReporter: {
            reporters: [
                {type: 'json', subdir: '.', file: 'coverage-final.json'}
            ]
        },

        browserify: {
            debug: true
        },

        singleRun: true
    })
};
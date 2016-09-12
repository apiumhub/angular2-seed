const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./tsconfig.json');
var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var Builder = require('systemjs-builder');

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});
// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function () {
    return gulp.src(['app/**/*', 'index.html', 'styles.css', '!app/**/*.ts'], {base: './'})
        .pipe(gulp.dest('dist'))
});
gulp.task('tslint', function () {
    return gulp.src('app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});
// copy dependencies
gulp.task('copy:libs', ['clean'], function () {
    return gulp.src([
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/axios/dist/axios.min.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js',
            'node_modules/es6-shim/es6-shim.min.js'
        ])
        .pipe(gulp.dest('dist/lib'))
});

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['app/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
    return function () {
        return watchedBrowserify
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest("dist"));

    }
}
var Builder = require('systemjs-builder');

gulp.task('bundle', function(cb) {
    var builder = new Builder('.', './systemjs.config.js');
    builder.buildStatic('app/main.js', 'dist/app.bundle.js').then(cb());
});
// TypeScript compile
gulp.task('compile', ['clean'], bundle());

gulp.task('build', ['compile', 'copy:libs', 'copy:assets']);
gulp.task('default', ['build']);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);

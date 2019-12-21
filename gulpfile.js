// General
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    package = require('./package.json'),
    paths = package.paths;
    sass.compiler = require('node-sass');

var banner = [
    '/*!\n' +
    ' * @version <%= package.version %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * <%= package.url %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
].join('');

gulp.task('html', function () {
    return gulp.src('*.html');
});

gulp.task('styles', function () {
    return gulp.src(['scss/app.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer())
        .pipe(sourceMaps.write(undefined, {
            sourceRoot: null
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream());
});

// gulp main style minified
gulp.task('styles:prod', function () {
    return gulp.src(['scss/app.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest(paths.css))
});



gulp.task('stylesPlugins', function () {
    return gulp.src(['scss/plugins.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer())
        .pipe(sourceMaps.write(undefined, {
            sourceRoot: null
        }))
        .pipe(rename({
            suffix: '.min'
        }))

        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream());
});

// gulp main style minified
gulp.task('stylesPlugins:prod', function () {
    return gulp.src(['scss/plugins.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest(paths.css))
});

// task: watch
gulp.task('watch', function () {
    gulp.watch('*.html', ['watch-html']);
    gulp.watch(paths.cssdev + '/**/*.scss', ['styles', 'stylesPlugins']);
    browserSync.init({
        notify: true,
        injectChanges: true,
        server: {
            baseDir: "./"
        },
    });
});

// task: html
gulp.task('watch-html', ['html'], function(done){
    browserSync.reload();
    done();
});


// task: production
gulp.task('prod', ['styles:prod', 'stylesPlugins:prod']);

// task: default
gulp.task('default', ['watch', 'html', 'styles', 'stylesPlugins']);

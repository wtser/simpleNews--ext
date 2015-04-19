var gulp = require('gulp');
var sass = require('gulp-sass');
var minicss = require('gulp-mini-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
    gulp.src('./stylesheet/tenread.scss')
        .pipe(sass())
        .pipe(gulp.dest('./stylesheet/'));
});


var sassWatcher = gulp.watch([
    './stylesheet/*/*.scss',
    './stylesheet/*.scss',
    './script/*',
    './template/*',
    '*.html'
], ['build']);
sassWatcher.on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');

});

gulp.task('compressJS', function () {
    gulp.src([
        'bower_components/angular/angular.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'script/router.js',
        'script/controller.js',
        'bower_components/zepto/zepto.min.js'
    ])

        .pipe(concat('app.js'))
        .pipe(uglify({mangle:false}))
        .pipe(gulp.dest('../build/'));
});
gulp.task('compressCSS', function () {
    gulp.src(['stylesheet/tenread.css', 'bower_components/fontawesome/css/font-awesome.min.css'])
        .pipe(concat('app.css'))
        .pipe(minicss())
        .pipe(gulp.dest('../build/'));
});
gulp.task('copyFiles', function () {
    gulp.src(['bower_components/fontawesome/fonts/*'], {base: "./bower_components/fontawesome"})
        .pipe(gulp.dest('../build/'));
    gulp.src(['icon/*'], {base: "."})
        .pipe(gulp.dest('../build/'));
    gulp.src(['template/*','manifest.json'], {base: '.'})
        .pipe(gulp.dest('../build/'));
});


gulp.task('default', ['sass']);
gulp.task('build', ['sass', 'compressCSS', 'compressJS', 'copyFiles']);
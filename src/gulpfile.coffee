gulp = require('gulp')
sass = require('gulp-sass')
minicss = require('gulp-mini-css')
concat = require('gulp-concat')
uglify = require('gulp-uglify')
#var ver = require('gulp-ver');
gulp.task 'sass', ->
    gulp.src('./stylesheet/tenread.scss').pipe(sass()).pipe gulp.dest('./stylesheet/')

gulp.task 'watcher', ->
    watcher = gulp.watch([
        './stylesheet/**/*.scss'
        './script/*'
        './template/*'
        '*.html'
    ], ['build'])

    watcher.on 'change', (event) ->
        console.log 'File ' + event.path + ' was ' + event.type + ', running tasks...'

gulp.task 'compressJS', ->
    gulp.src([
        'bower_components/angular/angular.min.js'
        'bower_components/angular-ui-router/release/angular-ui-router.min.js'
        'script/*.js'
        'bower_components/zepto/zepto.min.js'
    ]).pipe(concat('app.js')).pipe(uglify(mangle: false)).pipe gulp.dest('../build/')
gulp.task 'compressCSS', ->
    gulp.src([
        'stylesheet/tenread.css'
        'bower_components/fontawesome/css/font-awesome.min.css'
    ]).pipe(concat('app.css')).pipe(minicss()).pipe gulp.dest('../build/')
gulp.task 'copyFiles', ->
    gulp.src(['bower_components/fontawesome/fonts/*'],
        base: './bower_components/fontawesome').pipe gulp.dest('../build/')
    gulp.src([
        'icon/*'
        'template/*'
        'manifest.json'
        'background.js'
    ], base: '.').pipe gulp.dest('../build/')
gulp.task 'default', ['build', 'watcher']
gulp.task 'build', [
    'sass'
    'compressCSS'
    'compressJS'
    'copyFiles'
]

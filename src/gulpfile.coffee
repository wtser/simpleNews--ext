gulp = require('gulp')
sass = require('gulp-sass')
minicss = require('gulp-mini-css')
concat = require('gulp-concat')
uglify = require('gulp-uglify')
coffee = require('gulp-coffee')
#var ver = require('gulp-ver');
gulp.task 'sass', ->
    gulp.src('./stylesheet/tenread.scss').pipe(sass()).pipe gulp.dest('./stylesheet/')

gulp.task 'coffee', ->
    gulp.src './script/*.coffee'
    .pipe coffee()
    .pipe gulp.dest './script/'

gulp.task 'watcher', ->
    watcher = gulp.watch([
        './stylesheet/**/*.scss'
        './script/*'
        './template/*'
        '*.html'
    ], ['compile'])

    watcher.on 'change', (event) ->
        console.log 'File ' + event.path + ' was ' + event.type + ', running tasks...'

gulp.task 'compressJS', ->
    gulp.src([
        'bower_components/angular/angular.min.js'
        'bower_components/angular-ui-router/release/angular-ui-router.min.js'
        'bower_components/ng-sortable/dist/ng-sortable.js'
        'script/*.js'
        '!script/background.js'
        'bower_components/zepto/zepto.min.js'
    ]).pipe(concat('app.js')).pipe(uglify(mangle: false)).pipe gulp.dest('../build/script/')

    gulp.src ['script/background.js']
    .pipe(uglify(mangle: false)).pipe gulp.dest('../build/script/')
gulp.task 'compressCSS', ->
    gulp.src([
        'stylesheet/tenread.css'
        'bower_components/fontawesome/css/font-awesome.min.css'
        'bower_components/ng-sortable/dist/ng-sortable.css'
    ]).pipe(concat('app.css')).pipe(minicss()).pipe gulp.dest('../build/')
gulp.task 'copyFiles', ->
    gulp.src(['bower_components/fontawesome/fonts/*'],
        base: './bower_components/fontawesome').pipe gulp.dest('../build/')
    gulp.src([
        'icon/*'
        'template/*'
        'manifest.json'
    ], base: '.').pipe gulp.dest('../build/')
gulp.task 'default', ['watcher']
gulp.task 'compile', [
    'sass'
    'coffee'
]
gulp.task 'build', [
    'sass'
    'coffee'
    'compressCSS'
    'compressJS'
    'copyFiles'
]

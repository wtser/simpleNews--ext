var gulp = require('gulp');
var sass = require('gulp-sass');
var minicss = require('gulp-mini-css');

gulp.task('sass', function () {
    gulp.src('./stylesheet/tenread.scss')
        .pipe(sass())
        .pipe(minicss())
        .pipe(gulp.dest('./stylesheet/'));
});


var sassWatcher = gulp.watch(['./stylesheet/*/*.scss','./stylesheet/*.scss'], ['sass']);
sassWatcher.on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');

});


gulp.task('default', ['sass']);
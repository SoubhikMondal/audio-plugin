var del = require('del');
var gulp = require('gulp');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var nodemon = require('gulp-nodemon');


gulp.task('clean', function(cb){
  del('dist', cb);
});

gulp.task('buildJS', function(){
 return gulp.src('src/**.js')
    .pipe(concat('jquery.audio-plugin.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('buildCSS', function(){
  return gulp.src('src/**.scss')
    .pipe(sass({outputStyle:'compressed'})
    .on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', function () {
  nodemon({
    script: 'server/server.js',
    ext: 'js html css'
  });
});


gulp.task('copyHTML', function(){
  return gulp.src('src/test.html')
    .pipe(flatten())
    .pipe(gulp.dest('dist'));
});


gulp.task('copyCSS', function(){
  return gulp.src('src/*.css')
    .pipe(flatten())
    .pipe(gulp.dest('dist'));
});

// --------------------------------------------

gulp.task('scss-watcher', function () {
    return gulp.watch('src/*.scss', function () {
        gulp.start('buildCSS');
    });
});

gulp.task('js-watcher', function () {
    return gulp.watch('src/*.js', function () {
        gulp.start('buildJS');
    });
});

gulp.task('html-watcher', function () {
    return gulp.watch('src/*.html', function () {
        gulp.start('copyHTML');
    });
});


gulp.task('watch', ['html-watcher', 'scss-watcher', 'js-watcher']);

// ----------------------------------------


gulp.task('dev', ['build-dev'], function(){
  gulp.start('serve');
  gulp.start('watch');
});

gulp.task('build', ['clean', 'buildCSS', 'buildJS']);
gulp.task('build-dev', ['clean', 'copyHTML', 'buildJS', 'copyCSS']);

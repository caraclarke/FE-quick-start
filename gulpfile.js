var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');

// browser live reload
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
});

// scss to css
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.+(scss|css)')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// useref build
gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    // minifies if js file
    .pipe(gulpIf('*.js', uglify()))
    // minifies if css
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

// watch
gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.+(scss|css)', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
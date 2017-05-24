var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
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

// clean up generated files
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// clear cache
gulp.task('cache:clear', function(done) {
  return cache.clearAll(done);
});

// minify images
gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'))
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
});

// watch
gulp.task('watch', ['browserSync', 'sass', 'images'], function() {
  gulp.watch('app/scss/**/*.+(scss|css)', ['sass']);
  gulp.watch('app/img/**/*.+(png|jpg|gif|svg)', ['images']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var sass = require('gulp-sass');

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

// watch
gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.+(scss|css)', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
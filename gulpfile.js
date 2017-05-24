var gulp = require('gulp');
var sass = require('gulp-sass');

// scss to css
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.+(scss|css)')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
});
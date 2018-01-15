var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var del = require('del');
var ejs = require('gulp-ejs');
var eslint = require('gulp-eslint');
var glob = require('glob');
var gulpicon = require('gulpicon/tasks/gulpicon');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var styleLint = require('gulp-stylelint');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

// ---------- TASKS FOR MAIN APPLICATION-------

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
});

gulp.task('cache:clear', function(cb) {
  return cache.clearAll(cb);
});

gulp.task('clean:build', function() {
  return del.sync('build');
});

gulp.task('clean:js', function() {
  return del.sync('js/build');
});

gulp.task('clean:ejs', function() {
  del.sync('app/*.html');
});

gulp.task('build:vendor', function() {
  return gulp.src('app/vendor/**/*.js')
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('build:portal', function() {
  return gulp.src(['app/css/base/*.css', 'app/css/portal/**/*.css'])
    .pipe(gulp.dest('dist/css/portal/'));
});

gulp.task('move:icons', function() {
  return gulp.src('app/scss/icons/*.css')
    .pipe(gulp.dest('app/img/icons'));
});

gulp.task('build:icons', function() {
  return gulp.src('app/img/icons/icons.**.css')
    .pipe(gulp.dest('dist/img/icons/'));
});

gulp.task('build:img', function() {
  return gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('ejs', ['clean:ejs'], function() {
  return gulp.src('app/views/pages/**/*.ejs')
    .pipe(ejs(
      {
        data: require('./app/js/data.json')
      },
      { ext:'.html' }))
    .on('error', gutil.log)
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js', ['lint'], function() {
  return gulp.src(['app/js/*.js', '!app/js/*-polyfill.js'])
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('app/js/build/'))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }))
});

gulp.task('lint', function () {
  return gulp.src(['app/js/**/*.js', '!app/js/*-polyfill.js', '!app/js/portal/**', '!app/js/build/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:sass', function () {
  return gulp
    .src(['app/scss/**/*.scss', '!app/scss/base/*.scss', '!app/scss/portal/*.scss'])
    .pipe(styleLint({
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('sass', ['lint:sass'], function() {
  return gulp.src('app/scss/**/+(*.scss|*.css)')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
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

gulp.task('serve:build', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('build', function(cb) {
  runSequence('cache:clear', 'clean:build', ['sass', 'js', 'build:vendor'], 'build:portal', 'move:icons', 'build:icons', 'build:img', 'ejs', 'useref', cb)
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/img/icons/preview.html', ['move:icons']);
  gulp.watch('app/views/**/*.ejs', ['ejs']);
  gulp.watch(['app/js/**/*.js', '!app/js/build', '!app/js/build/**'], ['clean:js', 'js']);
  gulp.watch('app/js/**/*.json', ['ejs']);
});

gulp.task('default', function(cb) {
  runSequence('ejs', ['sass', 'js', 'browserSync', 'watch'], cb);
});

// ---------- GULPICON -------

// grab the config, tack on the output destination
var config = require('./icon-config.js');
config.dest = './app/img/icons';
// grab the file paths
var files = glob.sync('./app/img/icons/svg/*.svg');

// set up the gulp task
gulp.task('icons', gulpicon(files, config));

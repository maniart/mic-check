/*eslint strict: [2, "global"]*/
/*eslint-env node*/
'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  minifyHTML = require('gulp-minify-html'),
  sass = require('gulp-sass'),
  clean = require('gulp-clean'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  bower = require('gulp-bower'),
  eslint = require('gulp-eslint'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify');

gulp.task('clean', function() {
  return gulp.src('./dist/')
    .pipe(clean())
    .pipe(notify({
      title: 'Mic Check Clean',
      message: 'Build directory deleted.'
    }));
});

gulp.task('html', function() {
  return gulp.src('./src/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist'))
    .pipe(notify({
      title: 'Mic Check HTML',
      message: 'HTML Complete.'
    }));
});

gulp.task('sass', function() {
  return gulp.src('./src/styles/style.scss')
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .on('error', notify.onError(function(error) {
        return 'sass error: '.concat(error.message);
    }))
    .pipe(autoprefixer({
        cascade: false,
        remove: false
    }))
    .pipe(gulp.dest('./dist/styles/'))
    .pipe(notify({
      title: 'Mic Check Sass',
      message: 'Sass Complete.'
    }));
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(notify({
      title: 'Mic Check Lint',
      message: 'Linting Complete.'
    }));
});

gulp.task('javascript', function() {
  return gulp.src('./src/**/*.js*')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(notify({
      title: 'Mic Check JavaScript',
      message: 'JavaScript Complete.'
    }));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./dist'))
    .pipe(notify({
      title: 'Mic Check Bower',
      message: 'Bower Complete.'
    }));
});

gulp.task('connect', function() {
  connect.server({
    root: './dist',
    port: 2020
  });
});

gulp.task('build', ['html', 'sass', 'lint', 'bower', 'javascript']);

gulp.task('watch', function() {
  gulp.watch(['./src/**/*'], ['build']);
});

gulp.task('default', ['connect', 'watch']);

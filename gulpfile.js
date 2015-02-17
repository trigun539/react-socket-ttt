var gulp  = require('gulp'),
uglify    = require('gulp-uglify'),
rename    = require('gulp-rename'),
concat    = require('gulp-concat'),
concatCSS = require('gulp-concat-css'),
uglifyCSS = require('gulp-minify-css');

// Copy JS
gulp.task('copyJS', function() {
  return gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './bower_components/bootstrap/dist/js/bootstrap.js',
      './bower_components/react/react.js',
      './bower_components/react/JSXTransformer.js'
    ])
    .pipe(gulp.dest('./public/js/libs/'));
});

// Copy CSS
gulp.task('copyCSS', function() {
  return gulp.src([
      './bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/bootstrap/dist/css/bootstrap.css.map',
      './bower_components/font-awesome/css/font-awesome.css'
    ])
    .pipe(gulp.dest('./public/css/'));
});

// Copy Fonts
gulp.task('copyFonts', function() {
  return gulp.src([
      './bower_components/font-awesome/fonts/fontawesome-webfont.eot',
      './bower_components/font-awesome/fonts/fontawesome-webfont.svg',
      './bower_components/font-awesome/fonts/fontawesome-webfont.ttf',
      './bower_components/font-awesome/fonts/fontawesome-webfont.woff',
      './bower_components/font-awesome/fonts/FontAwesome.otf'
    ])
    .pipe(gulp.dest('./public/fonts/'));
});

// Bowercopy
gulp.task('bowercopy', ['copyJS', 'copyCSS', 'copyFonts']);

// Default Task
gulp.task('default', ['bowercopy']);
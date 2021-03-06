var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var compass = require('gulp-compass');
var browser = require('browser-sync');

gulp.task('browser', function() {
  browser({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('html', function() {
  gulp.src('./**/*.html')
    .pipe(plumber())
    .pipe(browser.reload({stream:true}));
});

gulp.task('sass', function() {
  gulp.src('assets/sass/**/*scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css'))
    .pipe(browser.reload({stream:true}));
});

gulp.task('js', function() {
  gulp.src('assets/js/**/*.js')
    .pipe(plumber())
    // .pipe(uglify())
    // .pipe(gulp.dest('assets/js/min'))
    .pipe(browser.reload({stream:true}));
});

gulp.task('compass', function(){
  gulp.src('assets/sass/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'config.rb',
      // comments: false,
      css: 'assets/css/',
      sass: 'assets/sass/'
    }))
    .pipe(browser.reload({stream:true}));
});

gulp.task('watch', function() {
  // gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('assets/js/**/*.js', ['js']);
  gulp.watch('assets/sass/**/*.scss', ['compass']);
  gulp.watch('./**/*.html', ['html']);
});

gulp.task('default', ['browser', 'watch']);

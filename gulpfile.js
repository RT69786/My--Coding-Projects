const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Copy html to production
function htmlTask(){
  return src('development/*.html', {encoding: false}, { sourcemaps: true })
    .pipe(dest('production/', { sourcemaps: '.' }));
}

// Sass Task
function scssTask(){
  return src('development/css/style.scss', {encoding: false}, { sourcemaps: true })
  .pipe(sass().on('error', sass.logError))
  .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('production/css', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('development/js/script.js', {encoding: false}, { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('production/js', { sourcemaps: '.' }));
}

function imgsTask(){
  return src('development/imgs/*.*', {encoding: false}, { sourcemaps: '.' })
    .pipe(dest('production/imgs', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: 'production'
    },
    port: 8080,
    open: true,
    notify: false
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('development/*.html', series(htmlTask, browsersyncReload));
  watch('development/css/**/*.scss', series(scssTask, browsersyncReload));
  watch('development/js/**/*.js', series(jsTask, browsersyncReload));
  // watch('development/imgs/*.*', series(imgsTask, browsersyncReload));
//watch(['development/*.html', 'development/css/**/*.scss', 'development/js/**/*.js'], series(htmlTask, scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  htmlTask,
  scssTask,
  jsTask,
  imgsTask,
  browsersyncServe,
  watchTask
);
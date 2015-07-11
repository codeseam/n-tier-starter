var gulp = require('gulp');
var del = require('del');
var webserver = require('gulp-webserver');
var mainBowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var templateCache = require('gulp-angular-templatecache');

var paths = {
  tmp: '.tmp',
  tmpLibs: '.tmp/libs/',
  tmpApp: '.tmp/app/',
  tmpCss: '.tmp/styles/',
  tmpImages: '.tmp/images/',
  tmpFonts: '.tmp/fonts/',
  tmpIndex: '.tmp/index.html',
  index: 'src/index.html',
  scripts: [
    'src/app/**/*.module.js',
    'src/app/**/*.js'
  ],
  css: [
    'src/styles/**/*.css'
  ],
  html: ['src/app/**/*.html'],
  images: ['src/images/**/*'],
  fonts: ['src/fonts/**/*'],
  templateCache: 'src/app/core/cache',
  bowerSrc: 'bower_components/**/*'
};

gulp.task('default', ['watch']);

gulp.task('watch', ['serve'], function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.html, ['templateCache']);
  gulp.watch(paths.css, ['styles']);
  gulp.watch(paths.images, ['copy-images']);
  gulp.watch(paths.fonts, ['copy-fonts']);
  gulp.watch(paths.bowerSrc, ['bower']);
  gulp.watch(paths.index, ['copy-all']);
});

gulp.task('bower', function() {
  var tmpLibs = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tmpLibs));

  return gulp.src(paths.tmpIndex)
    .pipe(inject(tmpLibs, {
      relative: true,
      name: 'libs'
    }))
    .pipe(gulp.dest(paths.tmp));

});

gulp.task('styles', function() {
  var css = gulp.src(paths.css).pipe(gulp.dest(paths.tmpCss));

  return gulp.src(paths.tmpIndex)
    .pipe(inject(css, {
      relative: true
    }))
    .pipe(gulp.dest(paths.tmp));

});

gulp.task('templateCache', function() {
  //remove templates in cache
  del(paths.templateCache);

  return gulp.src(paths.html)
    .pipe(templateCache({
      module: 'app.core',
      standAlone: false,
      root: 'app/'
    }))
    .pipe(gulp.dest(paths.templateCache));
});

gulp.task('clean-css', function() {
  del(paths.tmpCss);
});

gulp.task('clean-code', function() {
  var files = [].concat(
    paths.tmpApp,
    paths.tmp + '**/*.html'
  );
  del(files);
});

gulp.task('scripts', ['templateCache'], function() {

  var scripts = gulp.src(paths.scripts).pipe(gulp.dest(paths.tmpApp));

  return gulp.src(paths.tmpIndex)
    .pipe(inject(scripts, {
      relative: true
    }))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('copy-images', function () {
  return gulp.src(paths.images)
  .pipe(gulp.dest(paths.tmpImages));
});

gulp.task('copy-fonts', function () {
  return gulp.src(paths.fonts)
  .pipe(gulp.dest(paths.tmpFonts));
});

gulp.task('copy-all', ['copy-fonts', 'copy-images','templateCache'], function() {
  var tmpIndex = gulp.src(paths.index).pipe(gulp.dest(paths.tmp));
  var tmpLibs = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tmpLibs));
  var scripts = gulp.src(paths.scripts).pipe(gulp.dest(paths.tmpApp));
  var css = gulp.src(paths.css).pipe(gulp.dest(paths.tmpCss));

  tmpIndex.pipe(inject(scripts, {
      relative: true
    }))
    .pipe(inject(css, {
      relative: true
    }))
    .pipe(inject(tmpLibs, {
      relative: true,
      name: 'libs'
    }))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['copy-all'], function() {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      livereload: true,
      proxies: [{
        source: '/api',
        target: 'http://localhost:1337'
      }]
    }));
});

gulp.task('clean', function() {
  del(paths.tmp);
});

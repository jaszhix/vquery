var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  mochaPhantomJS = require('gulp-mocha-phantomjs'),
  uglify = require('gulp-uglifyjs');

gulp.task('browser-sync', function () {
  'use strict';
  browserSync({
    server: {
      //serve tests and the root as base dirs
      baseDir: ['./test/', './'],
      //make tests.html the index file
      index: 'tests.html'
    }
  });
});

gulp.task('browserify', function() {
  return browserify('./test/index.js')
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
    })
    .pipe(source('tests-browserify.js'))
    .pipe(gulp.dest('tmp/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('test', function () {
  return gulp.src('./test/tests.html')
    .pipe(mochaPhantomJS({reporter: 'spec', dump:'./tmp/test.log'}));
});

gulp.task('serve', ['browserify', 'browser-sync'], function () {
    'use strict';
    //when tests.js changes, browserify code and execute tests
    gulp.watch(['test/tests.js', 'src/text-changer.js'], ['browserify', 'test']);
});

gulp.task('uglify', function() {
  gulp.src('./dist/index.js')
    .pipe(uglify('v.min.js', {
      compress: {
        warnings: false,
        drop_console: true,
        dead_code: true,
        unused: true,
        booleans: true,
        join_vars: true,
        negate_iife: true,
        sequences: true,
        properties: true,
        evaluate: true,
        loops: true,
        if_return: true,
        cascade: true,
        unsafe: true
      },
      output: {
        comments: false
      }
    }))
    .pipe(gulp.dest('./'));
});
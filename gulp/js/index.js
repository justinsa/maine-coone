'use strict';
var _ = require('lodash'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    paths = require('./paths.js');

gulp.task('js:lint', function () {
  return gulp.src(paths.all)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('js:test', ['js:lint'], function () {
  process.env.MOCHA_TESTING = true;
  var mocha = require('gulp-mocha');
  return gulp.src(paths.server.test)
    .pipe(mocha({ reporter: 'spec' }))
    .on('end', function() { process.emit('closeConnections'); });
});

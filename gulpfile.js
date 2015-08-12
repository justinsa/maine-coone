'use strict';
require('./gulp');
var gulp = require('gulp');
gulp.task('lint', ['js:lint']);
gulp.task('test', ['js:test']);
gulp.task('default', ['test']);
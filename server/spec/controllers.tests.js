/* globals afterEach, describe */
'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    nodejection = require('nodejection'),
    path = require('path');
var tests = path.join(__dirname, 'controllers');

describe('controllers', function () {
  afterEach(function () {
    process.emit('closeConnections');
    nodejection.clean();
  });

  _.each(fs.readdirSync(tests), function (fileName) {
    require(path.join(tests, fileName));
  });
});
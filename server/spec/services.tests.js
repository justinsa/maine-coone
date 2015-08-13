/* globals after, afterEach, describe */
'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    nodejection = require('nodejection'),
    path = require('path');
var tests = path.join(__dirname, 'services');

describe('services', function () {
  afterEach(function () {
    nodejection.clean();
  });

  after(function () {
    process.emit('closeConnections');
  });

  _.each(fs.readdirSync(tests), function (fileName) {
    require(path.join(tests, fileName));
  });
});
'use strict';
var _ = require('lodash'),
    util = require('util');

module.exports = ['configuration', function (configuration) {
  var express = require('express'),
      router = express.Router();

  router.use(require('compression')());
  router.use(express.static(configuration.static.root));

  return router;
}];
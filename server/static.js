'use strict';
module.exports = ['configuration', function (configuration) {
  var express = require('express'),
      router = express.Router();

  router.use(require('compression')());
  router.use(express.static(configuration.static.root));

  return router;
}];
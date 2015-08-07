'use strict';
var _ = require('lodash'),
    express = require('express'),
    nodejection = require('nodejection'),
    Promise = require('bluebird');

module.exports = ['configuration', 'pipeline', function (configuration, pipeline) {
  var router = express.Router();

  router.use(require('compression')());

  var bodyParser = require('body-parser');
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());

  // Disable caching.
  router.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });

  // Hook-up controllers.
  var promises = _.map(_.keys(configuration.api.controllers), function (key) {
    var path = configuration.api.controllers[key];
    return nodejection.inject(require(path)).then(function (controller) {
      console.log('Loaded controller: ', key);
      pipeline(router, key, controller);
    });
  });

  router.use(require('errorhandler')(configuration.errors.options));

  return Promise.all(promises).then(function () {
    return router;
  });
}];

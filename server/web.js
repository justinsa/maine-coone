'use strict';
var _ = require('lodash'),
    express = require('express'),
    nodejection = require('nodejection'),
    Promise = require('bluebird');

module.exports = ['configuration', require('./static.js'), function (configuration, content) {
  var app = express(), promises = [];

  app.use(require('./responder.js'));
  console.log('Loading static content routing...');
  app.use(content);
  console.log('Loading API routing...');
  promises.push(nodejection.inject(require(configuration.api.path)).then(function (api) {
    app.use(api);
  }));

  app.get('/', function(req, res){
    res.sendFile(configuration.static.index);
  });

  return Promise.all(promises).then(function () {
    app.listen(configuration.environment.port);
  });
}];
'use strict';
var _ = require('lodash'),
    path = require('path');

module.exports = function (options) {
  if (!_.isEmpty(options)) {
    console.log('Using configuration overrides: ', options);
  }
  options = _.defaultsDeep({ data: {} }, options);
  var configuration = {
    environment: {
      port: process.env.PORT || 8080,
      target: process.env.NODE_ENV || 'local',
      isHeroku: function () { return !_.isEmpty(process.env.NODE_ENV); },
      isLocal: function () { return _.isEmpty(process.env.NODE_ENV); },
      isProduction: function () { return process.env.NODE_ENV === 'production'; }
    },
    services: {
      data: path.join(__dirname, 'server', 'data.service.js'),
      pipeline: path.join(__dirname, 'server', 'http-pipeline.service.js')
    },
    api: {
      path: path.join(__dirname, 'server', 'api.js'),
      methods: ['get'],
      controllers: {
        diagnostic: path.join(__dirname, 'server', 'diagnostic.controller.js'),
        recalls: path.join(__dirname, 'server', 'recalls.controller.js')
      }
    },
    static: {
      path: path.join(__dirname, 'server', 'static.js'),
      index: path.join(__dirname, 'client', 'index.html'),
      root: path.join(__dirname, 'client')
    },
    web: {
      path: path.join(__dirname, 'server', 'web.js')
    },
    data: {
      path: path.join(__dirname, 'database'),
      schemas: [
        path.join(__dirname, 'database', 'recall.js')
      ],
      uri: options.data.uri || process.env.MONGOLAB_URI
    },
    errors: {
      options: {
        showStack: true,
        dumpExceptions: true
      }
    }
  };
  return configuration;
};
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
    api: {
      path: path.join(__dirname, 'server', 'api.js'),
    },
    static: {
      path: path.join(__dirname, 'server', 'static.js'),
      index: path.join(__dirname, 'client', 'index.html')
    },
    data: {
      path: path.join(__dirname, 'database'),
      schemas: [
        path.join(__dirname, 'database', 'recall.js')
      ],
      uri: options.data.uri || process.env.MONGOLAB_URI
    }
  };
  return configuration;
};

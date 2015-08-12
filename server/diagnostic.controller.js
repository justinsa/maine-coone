'use strict';
var _ = require('lodash'),
    Promise = require('bluebird'),
    exec = Promise.promisify(require('child_process').exec);

module.exports = ['configuration', function (configuration) {
  return {
    '/': {
      get: function () {
        return 204;
      }
    },
    '/coffee': {
      get: function () {
        return 418;
      }
    },
    '/versions/:type': {
      get: function (req) {
        switch (req.params.type) {
          case 'bower':
            return exec('bower list').then(function (stdout) {
              return [200, 'text', stdout];
            });
          case 'npm':
            return exec('npm list').then(function (stdout) {
              return [200, 'text', stdout];
            });
          default:
            return 404;
        }
      }
    },
    '/configuration/:key': {
      get: function (req) {
        return _.has(configuration, req.params.key) ? [200, undefined, configuration[req.params.key]] : 404;
      }
    }
  };
}];

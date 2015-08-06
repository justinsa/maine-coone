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
      get: function (req, res) {
        switch (req.params.type) {
          case 'bower':
            return exec('bower list').then(function (stdout) {
              return [200, 'text', stdout];
            });
            break;
          case 'npm':
            return exec('npm list').then(function (stdout) {
              return [200, 'text', stdout];
            });
            break;
          default:
            return 404;
        }
      }
    },
    '/configuration/:key': {
      get: function (req, res) {
        return _.has(configuration, req.params.key) ? [200, undefined, configuration[req.params.key]] : 404;
      }
    }
  };
}];

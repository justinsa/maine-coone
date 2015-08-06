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
              // TODO: Determine how to send this back as plain text
              res.send(stdout);
              return 0;
            });
            break;
          case 'npm':
            return exec('npm list').then(function (stdout) {
              // TODO: Determine how to send this back as plain text
              res.send(stdout);
              return 0;
            });
            break;
          default:
            return 404;
        }
      }
    },
    '/configuration/:key': {
      get: function (req, res) {
        if (_.has(configuration, req.params.key)) {
          return configuration[req.params.key];
        } else {
          return 404;
        }
      }
    }
  };
}];

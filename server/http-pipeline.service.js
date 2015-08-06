'use strict';
var _ = require('lodash'),
    Promise = require('bluebird'),
    util = require('util');

module.exports = [function () {
  function execute (req, res, next, route) {
    if (_.isFunction(route)) {
      return Promise.method(route)(req, res).then(function (result) {
        if (_.isUndefined(result)) {
          if (!res.headersSent) {
            res.responder(204);
          }
        } else if (_.isNumber(result)) {
          if (result === 0) {
            // 0 is a sentinel result to indicate the route sent the response.
            return;
          }
          res.responder(result);
        } else if (result) {
          res.responder(200, _.has(result, 'toJSON') ? result.toJSON() : result);
        }
      }).catch(function (code) {
        console.error(code);
        res.responder(500);
      });
    } else {
      res.responder(404);
    }
  }

  return function (router, key, controller) {
    _.each(_.keys(controller), function (route) {
      var path = util.format('/%s%s', key, (route === '/' ? '' : route));
      console.log('  ', path);
      router.route(path)
        .get(function (req, res, next) {
          console.log('GET: %s on %s', route, key);
          execute(req, res, next, controller[route].get);
        })
        .put(function (req, res) {
          res.responder(404);
        })
        .post(function (req, res) {
          res.responder(404);
        })
        .delete(function (req, res) {
          res.responder(404);
        })
        .head(function (req, res) {
          res.responder(404);
        });
    });
  };
}];

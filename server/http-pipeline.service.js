'use strict';
var _ = require('lodash'),
    Promise = require('bluebird'),
    util = require('util');

module.exports = ['configuration', function (configuration) {
  function execute (req, res, next, route) {
    if (_.isFunction(route)) {
      return Promise.method(route)(req, res).then(function (result) {
        if (_.isNumber(result)) {
          res.responder(result);
        } else if (_.isUndefined(result) || _.isNull(result)) {
          // An undefined or null result value either indicates the route handled the response
          // or if no headers have been sent that the response is a 204.
          if (!res.headersSent) {
            res.responder(204);
          }
        } else if (_.isArray(result)) {
          res.responder.apply(null, result);
        } else {
          console.error('Route handler returned a malformed result: ', result);
          res.responder(500);
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
      _.each(configuration.api.methods, function (method) {
        router.route(path)[method](function (req, res, next) {
          console.log('%s: %s on %s', method, route, key);
          execute(req, res, next, controller[route][method]);
        });
      });
    });
  };
}];

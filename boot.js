'use strict';
var _ = require('lodash'),
    cluster = require('cluster'),
    nodejection = require('nodejection'),
    Promise = require('bluebird'),
    util = require('util');

console.log('Registering configuration');
nodejection.register('configuration', require('./configuration.js'));

Promise.resolve().return(nodejection.inject('configuration')).then(function (configuration) {
  var workerName = cluster.isMaster ? 'Master' : util.format('Peon #%d', cluster.worker.id);
  console.log('Loading %s', workerName);

  console.log('Registering services');
  _.forEach(configuration.services, function (path, key) {
    nodejection.register(key, require(path));
  });

  if ((configuration.environment.isHeroku() && cluster.isMaster) || !configuration.environment.isHeroku()) {
    console.log('Starting server in %s environment', configuration.environment.target);
  }

  if (cluster.isMaster && configuration.environment.isHeroku()) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; ++i) {
      cluster.fork().on('message', console);
    }

    // Listen for dying workers in production and respawn
    if (configuration.environment.isProduction()) {
      cluster.on('exit', function (worker) {
        console.error('Peon #%d down! Using phoenix down!', worker.id);
        cluster.fork().on('message', console);
      });
    }
  } else {
    // Boot up the web code.
    return nodejection.inject(require(configuration.web.path)).then(function () {
      console.log('%s reporting for duty, SIR!', workerName);
    });
  }
}).catch(function (error) {
  var foundError, err = error;
  while (!_.isUndefined(err) && _.isUndefined(foundError)) {
    if (_.isError(err.reason)) {
      foundError = err.reason;
    } else if (_.isError(err.error)) {
      foundError = err.error;
    } else {
      err = err.reason;
    }
  }
  console.error(foundError ? foundError.stack : error);
  process.exit(1);
});

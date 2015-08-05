'use strict';
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Promise = require('bluebird');

module.exports = function (configuration) {
  return new Promise(function (resolve, reject) {
    console.log('Attempting connection to: ', configuration.data.uri);
    mongoose.connect(configuration.data.uri);
    var connection = mongoose.connection;
    connection.on('error', console.error.bind(console, '  Connection error: '));
    connection.once('open', function () {
      console.log('  Connected.');
      _.each(configuration.data.schemas, function (schema) {
        require(schema)(mongoose);
      });
      resolve(mongoose);
    });
  });
}
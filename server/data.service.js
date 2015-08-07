'use strict';
var _ = require('lodash'),
    Promise = require('bluebird');

var distinct = function (model, property) {
  return new Promise(function (resolve, reject) {
    model.distinct(property, {}, function (err, items) {
      if (err) {
        reject(err);
        return;
      }
      resolve([200, undefined, items]);
    });
  });
};

module.exports = ['configuration', function (configuration) {
  return require(configuration.data.path)(configuration).then(function (mongoose) {
    var data = {
      connection: mongoose,
      query: {
        distinct: distinct
      },
      utils: require(configuration.data.utils.path)()
    };

    _.each(mongoose.modelNames(), function (model) {
      data[model] = mongoose.model(model);
    });

    process.on('closeConnections', function() { data.connection.close(); });
    process.on('exit', function () { data.connection.close(); });

    return data;
  });
}];

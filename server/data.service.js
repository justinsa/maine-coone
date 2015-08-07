'use strict';
var _ = require('lodash');

module.exports = ['configuration', function (configuration) {
  return require(configuration.data.path)(configuration).then(function (mongoose) {
    var data = {
      connection: mongoose,
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

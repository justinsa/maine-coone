'use strict';
var path = require('path');

module.exports = {
  bower: function (filePath) {
    return path.join('./client/js/vendor', filePath);
  },
  client: {
    js: function (filePath) {
      return path.join('./client/js', filePath);
    },
    root: function (filePath) {
      return path.join('./client', filePath);
    },
    test: function (filePath) {
      return path.join('./client/js/spec', filePath);
    }
  },
  database: function (filePath) {
    return path.join('./database', filePath);
  },
  npm: function () {
    return './node_modules';
  },
  root: function () {
    return '.';
  },
  server: {
    root: function (filePath) {
      return path.join('./server', filePath);
    },
    test: function (filePath) {
      return path.join('./server/spec', filePath);
    }
  }
};
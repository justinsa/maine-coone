'use strict';
var _ = require('lodash'),
    glob = require('glob'),
    directory = require('../path-utils.js');

// Server application sources
var source = {
  client: {
    application: []
      .concat(directory.client.js('controllers/index.js'))
      .concat(glob.sync(directory.client.js('controllers/**/*.controller.js')))
      .concat(directory.client.js('directives/index.js'))
      .concat(glob.sync(directory.client.js('directives/**/*.directive.js')))
      .concat(directory.client.js('filters/index.js'))
      .concat(glob.sync(directory.client.js('filters/**/*.filter.js')))
      .concat(directory.client.js('services/index.js'))
      .concat(glob.sync(directory.client.js('services/**/*.service.js')))
      .concat(directory.client.js('app.js'))
  },
  database: []
    .concat(directory.database('*.js')),
  server: {
    application: []
      .concat(directory.root('*.js'))
      .concat(glob.sync(directory.server.root('*.js'))),
    test: {
      all: []
        .concat(glob.sync(directory.server.test('**/*.js'))),
      runner: []
        .concat(glob.sync(directory.server.test('*.js')))
    },
  }
}

source.all = []
  .concat(source.client.application)
  .concat(source.database)
  .concat(source.server.application)
  .concat(source.server.test.all);

module.exports = source;

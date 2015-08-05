/******************************************************************************
 * Imports vehicle recall data from a JSON data file to a MongoDB database.
 *****************************************************************************/
'use strict';

var _ = require('lodash'),
    argv = require('minimist')(process.argv.slice(2)),
    configuration = require('../configuration.js')({ data: { uri: argv.db } }),
    db = require(configuration.data.path)(configuration),
    fs = require('fs'),
    ProgressBar = require('progress'),
    Promise = require('bluebird'),
    util = require('util');

var dataset = {
  recalls: {
    data: []
  }
};

console.log('0.1. Load data files if exist');
_.each(_.keys(dataset), function (key) {
  try {
    var rawFileData = fs.readFileSync(key + '.json');
    dataset[key].data = JSON.parse(rawFileData);
    console.log('  Data file found for: ', key);
  } catch (e) {
    dataset[key].data = [];
    console.log('  No data file found for: ', key);
  }
});

// Variable for progress bar object
var bar = null;
var generateProgressBar = function (total) {
  if (bar) {
    bar.terminate();
    bar = null;
  }
  return new ProgressBar('  [:bar] :current / :total (:percent)', {
    total: total,
    width: 20,
    complete: '=',
    incomplete: ' '
  });
};

db.then(function (mongoose) {
  db = mongoose;
  console.log('1.1. Insert all recalls');
  if (_.isEmpty(dataset.recalls.data)) {
    console.log('  Recall data empty. Skipping inserts.')
    return;
  }
  console.log(util.format('  Recall data found. Performing %d inserts.', dataset.recalls.data.length));
  bar = generateProgressBar(dataset.recalls.data.length);
  return dataset.recalls.data;
}).each(function (recall) {
  return db.model('Recall').create({
    Year: recall.year,
    Make: recall.make,
    Model: recall.model,
    Manufacturer: recall.manufacturer,
    Component: recall.component,
    Summary: recall.summary,
    Consequence: recall.consequence,
    Remedy: recall.remedy,
    Notes: recall.notes,
    NHTSACampaignNumber: recall.NHTSACampaignNumber,
    ReportReceivedDate: recall.ReportReceivedDate
  }, function (err) {
    if (err) {
      console.log('  Failed to save: ', recall.NHTSACampaignNumber);
      console.log('  ', err.message);
    }
    bar.tick();
  });
}).then(function () {
  if (bar) {
    bar.terminate();
  }
  console.log('Import successful.');
}).error(function (error) {
  console.error(error.message);
});

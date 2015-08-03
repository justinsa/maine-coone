/******************************************************************************
 * Extracts all available vehicle recall data from the NHTSA public web API.
 * Extracted data is written to local disk as JSON across multiple files.
 * Vehicle Recall API Documentation:
 *
 *   http://www.nhtsa.gov/webapi/Default.aspx?Recalls/API/83#
 *
 * The NHTSA public web API is bewilderingly inflexible and does not allow for
 * any access to broad recall data via singular queries. Instead, recall data
 * is only available for: ModelYear, Make, and Model (as a triple).
 *****************************************************************************/
'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    ProgressBar = require('progress'),
    Promise = require('bluebird'),
    request = Promise.promisify(require('request')),
    util = require('util');

var nhtsa = {
  api: {
    years: 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle?format=json',
    makes: 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle/modelyear/%d?format=json',
    models: 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle/modelyear/%d/make/%s?format=json',
    recalls: 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle/modelyear/%d/make/%s/model/%s?format=json'
  }
};
var dataset = {
  years: {
    fileExists: false,
    data: []
  },
  makes: {
    fileExists: false,
    data: []
  },
  models: {
    fileExists: false,
    data: []
  },
  recalls: {
    fileExists: false,
    data: []
  }
};

// Check for intermediary data file existence in local directory to pre-populate data sets.
console.log('0.1. Load data files if exist');
_.each(_.keys(dataset), function (key) {
  try {
    var rawFileData = fs.readFileSync(key + '.json');
    dataset[key].data = JSON.parse(rawFileData);
    dataset[key].fileExists = true;
    console.log('  Data file found for: ', key);
  } catch (e) {
    dataset[key].data = [];
    console.log('  No data file found for: ', key);
  }
});

var toJSON = function (raw) {
  var result = [];
  try {
    result = JSON.parse(raw);
    if (!_.has(result, 'Results')) {
      throw new Error('No Results property on object');
    }
    result = result.Results;
  } catch (e) {
    result = [];
    console.error(e.message);
    console.error(raw);
  }
  return result;
};

// Variable for progress bar object
var bar = null;
var generateProgressBar = function (total) {
  if (bar) {
    bar.terminate();
    bar = null;
  }
  return new ProgressBar('  [:bar] :current / :total (:percent) :eta', {
    total: total,
    width: 20,
    complete: '=',
    incomplete: ' '
  });
};

new Promise(function (resolve) {
  console.log('1.1. Get all years');
  if (dataset.years.fileExists === true) {
    console.log('  Year data found. Skipping fetch.');
    resolve(true);
    return;
  }
  resolve(request(nhtsa.api.years).spread(function (response, body) {
    if (response.statusCode === 200) {
      _.each(toJSON(body), function (year) {
        dataset.years.data.push(year.ModelYear);
      });
    }
  }));
}).then(function () {
  console.log('  # of Years: ', dataset.years.data.length);
  if (dataset.years.fileExists !== true) {
    console.log('1.2. Write JSON data to disk: years.json');
    fs.writeFileSync('years.json', JSON.stringify(dataset.years.data));
  }
  console.log('2.1. Get all makes by { year }');
  if (dataset.makes.fileExists === true) {
    console.log('  Make data found. Skipping fetch.');
    return [];
  }
  bar = generateProgressBar(dataset.years.data.length);
  return dataset.years.data;
}).each(function (year) {
  return request(util.format(nhtsa.api.makes, year)).spread(function (response, body) {
    if (response.statusCode === 200) {
      _.each(toJSON(body), function (make) {
        dataset.makes.data.push({
          year: make.ModelYear,
          make: make.Make
        });
      });
    }
    bar.tick();
  });
}).then(function () {
  console.log('  # of Makes: ', dataset.makes.data.length);
  if (dataset.makes.fileExists !== true) {
    console.log('2.2. Write JSON data to disk: makes.json');
    fs.writeFileSync('makes.json', JSON.stringify(dataset.makes.data));
  }
  console.log('3.1. Get all models by { year, make }');
  if (dataset.models.fileExists === true) {
    console.log('  Model data found. Skipping fetch.');
    return [];
  }
  bar = generateProgressBar(dataset.makes.data.length);
  return dataset.makes.data;
}).each(function (make) {
  return request(util.format(nhtsa.api.models, make.year, make.make)).spread(function (response, body) {
    if (response.statusCode === 200) {
      _.each(toJSON(body), function (model) {
        dataset.models.data.push({
          year: model.ModelYear,
          make: model.Make,
          model: model.Model
        });
      });
    }
    bar.tick();
  });
}).then(function () {
  console.log('  # of Models: ', dataset.models.data.length);
  if (dataset.models.fileExists !== true) {
    console.log('3.2. Write JSON data to disk: models.json');
    fs.writeFileSync('models.json', JSON.stringify(dataset.models.data));
  }
  console.log('4.1. Get all recalls by { year, make, and model }');
  if (dataset.recalls.fileExists === true) {
    console.log('  Recall data found. Skipping fetch.');
    return [];
  }
  bar = generateProgressBar(dataset.models.data.length);
  return dataset.models.data;
}).each(function (model) {
  return request(util.format(nhtsa.api.recalls, model.year, model.make, model.model)).spread(function (response, body) {
    if (response.statusCode === 200) {
      _.each(toJSON(body), function (recall) {
        dataset.recalls.data.push({
          year: recall.ModelYear,
          make: recall.Make,
          model: recall.Model,
          manufacturer: recall.Manufacturer,
          component: recall.Component,
          summary: recall.Summary,
          consequence: recall.Conequence, // 'Conequence' is not a typo. This is actually mispelled in the live service. *facepalm*
          remedy: recall.Remedy,
          notes: recall.Notes,
          NHTSACampaignNumber: recall.NHTSACampaignNumber,
          ReportReceivedDate: recall.ReportReceivedDate
        });
      });
      bar.tick();
    }
  });
}).then(function () {
  if (bar) {
    bar.terminate();
  }
  console.log('  # of Recalls: ', dataset.recalls.data.length);
  if (dataset.recalls.fileExists !== true) {
    console.log('4.2. Write JSON data of recalls to disk: recalls.json');
    fs.writeFileSync('recalls.json', JSON.stringify(dataset.recalls.data));
  }
}).error(function (error) {
  console.error(error.message);
});

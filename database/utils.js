'use strict';
var _ = require('lodash');

module.exports = function () {
  var inFilter = function (key, items) {
    var where = {};

    if (!_.isUndefined(items) && !_.isEmpty(items)) {
      if (!_.isArray(items)) {
        items = [items];
      }
      where[key] = { $in: items };
    }

    return where;
  };

  var operation = function (query) {
    var op = _.isString(query.operation) ? query.operation.toLowerCase() : 'find';
    return _.includes(['count', 'find'], op) ? op : 'find';
  };

  var parseNumber = function (string, radix, options) {
    var value = parseInt(string, 10);
    options = _.defaults({ positive: false }, options);

    if (options.positive) {
      // If value must be positive then a negative value is equivalent to undefined
      if (value < 0) {
        value = undefined;
      }
    }

    return (_.isNumber(value) && !_.isNaN(value)) ? value : undefined;    
  };

  var pagination = function (query) {
    var op = operation(query),
        from = parseNumber(query.from, 10, { positive: true }),
        limit = parseNumber(query.limit, 10, { positive: true });

    // Only paginate if performing a find operation
    if (op === 'find' && !_.isUndefined(from) && !_.isUndefined(limit)) {
      return {
        from: from,
        limit: limit
      };
    }

    return undefined;
  };

  var rangeFilter = function (key, start, end) {
    var where = {}, startUndefined, endUndefined;

    start = parseNumber(start, 10, { positive: true });
    startUndefined = _.isUndefined(start);
    end = parseNumber(end, 10, { positive: true });
    endUndefined = _.isUndefined(end);

    if (!startUndefined && !endUndefined) {
      if (start > end) {
        where[key] = { $gte: end, $lte: start };
      } else {
        where[key] = { $gte: start, $lte: end };
      }
    } else if (!startUndefined) {
      where[key] = { $gte: start };
    } else if (!endUndefined) {
      where[key] = { $lte: end };
    }

    return where;
  };

  var toObject = function (model) {
    return _.isObject(model) ? model.toObject() : null;
  };

  var toObjects = function (models) {
    return _.map(models, function (model) {
      return model.toObject();
    });
  };

  return {
    inFilter: inFilter,
    operation: operation,
    pagination: pagination,
    parseNumber: parseNumber,
    rangeFilter: rangeFilter,
    toObject: toObject,
    toObjects: toObjects
  };
};
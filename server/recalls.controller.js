'use strict';
var _ = require('lodash'),
    Promise = require('bluebird');

module.exports = ['data', function (data) {
  var operation = function (query) {
    return query.count === 'true' ? 'count' : 'find';
  };

  var filters = function (query) {
    var start = parseInt(query.start, 10),
        end = parseInt(query.end, 10),
        where = {},
        i, startUndefined, endUndefined;

    start = (_.isNumber(start) && !_.isNaN(start)) ? start : undefined;
    end = (_.isNumber(end) && !_.isNaN(end)) ? end : undefined;
    startUndefined = _.isUndefined(start);
    endUndefined = _.isUndefined(end);

    if (!startUndefined && !endUndefined) {
      if (start > end) {
        where.Year = { $gte: end, $lte: start };
      } else {
        where.Year = { $gte: start, $lte: end };
      }
    } else if (!startUndefined) {
      where.Year = { $gte: start };
    } else if (!endUndefined) {
      where.Year = { $lte: end };
    }

    return where;
  };

  return {
    '/': {
      get: function (req) {
        return new Promise(function (resolve, reject) {
          data.Recall[operation(req.query)](filters(req.query)).exec(function (err, recalls) {
            if (err) {
              reject([500, undefined, err]);
              return;
            }
            resolve([200, undefined, _.isNumber(recalls) ? { count: recalls } : recalls]);
          });
        });
      }
    }
  };
}];
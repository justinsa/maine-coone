'use strict';
var _ = require('lodash'),
    Promise = require('bluebird');

module.exports = ['data', function (data) {
  var filters = function (query) {
    var where = data.utils.rangeFilter('Year', query.start, query.end);
    return _.assign(where, data.utils.inFilter('Make', query.makes));
  };

  return {
    '/': {
      get: function (req) {
        return new Promise(function (resolve, reject) {
          var op = data.utils.operation(req.query),
              pagination = data.utils.pagination(req.query);

          switch (op) {
            case 'count':
              data.Recall.count(filters(req.query)).exec(function (err, count) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve([200, undefined, { count: count }]);
              });
              break;
            default:
              var query = data.Recall.find(filters(req.query));
              if (pagination) {
                query.skip(pagination.from).limit(pagination.limit);
              }
              query.exec(function (err, recalls) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve([200, undefined, recalls]);
              });
              break;
          }
        });
      }
    }
  };
}];
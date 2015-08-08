'use strict';
angular.module('application.services')
  .factory('data', ['Restangular', function (Restangular) {
    var defaultQueryOptions = {
          start: 0,
          end: 9999,
          from: 0,
          limit: 25,
          makes: []
        };

    var merge = function (to, from) {
      return $.merge(to, from);
    };

    var overwrite = function (to, from) {
      to.length = 0;
      return merge(to, from);
    };

    return {
      api: {
        makes: {
          get: function () {
            return Restangular.all('makes').getList();
          }
        },

        recalls: {
          count: function (options) {
            var opts = _.assign({}, defaultQueryOptions, options);
            return Restangular.all('recalls').get('count', opts);
          },

          get: function (options) {
            var opts = _.assign({}, defaultQueryOptions, options);
            return Restangular.all('recalls').getList(opts);
          }
        },

        years: {
          get: function () {
            return Restangular.all('years').getList();
          }
        }
      },
      utils: {
        merge: merge,
        overwrite: overwrite
      }
    };
  }]);

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
      }
    };
  }]);

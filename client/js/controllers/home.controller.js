'use strict';
angular.module('application.controllers')
  .controller('HomeController', ['data', '$scope', function (data, $scope) {
    $scope.controls = {
      end: undefined,
      from: 0,
      limit: 25,
      makes: [],
      start: undefined
    };
    $scope.page = {
      current: 0,
      options: _.assign({}, $scope.controls),
      total: 0
    };
    $scope.results = {
      makes: [],
      recalls: [],
      years: []
    };

    $scope.actions = {
      makes: {
        filter: function (value) {
          value = _.isEmpty(value) ? '' : value.toUpperCase();
          return _.filter($scope.results.makes, function (make) {
            return _.includes(make.toUpperCase(), value);
          });
        }
      },

      search: function () {
        $scope.page.current = 1;
        _.assign($scope.page.options, _.pick($scope.controls, 'end', 'from', 'limit', 'makes', 'start'));
        if (_.isString($scope.controls.make) && !_.isEmpty($scope.controls.make)) {
          data.utils.overwrite($scope.page.options.makes, [$scope.controls.make]);
        }

        data.api.recalls.count($scope.page.options).then(function (total) {
          $scope.page.total = total.count;
        });

        data.api.recalls.get($scope.page.options).then(function (recalls) {
          data.utils.overwrite($scope.results.recalls, recalls);
        });
      },

      page: function () {
        $scope.page.options.from = ($scope.page.current - 1) * $scope.page.options.limit;

        data.api.recalls.get($scope.page.options).then(function (recalls) {
          data.utils.overwrite($scope.results.recalls, recalls);
        });
      }
    };

    data.api.years.get().then(function (years) {
      data.utils.overwrite($scope.results.years, years);
      $scope.controls.end = years[0];
      $scope.controls.start = years[years.length - 1];
      $scope.actions.search();
    });
    data.api.makes.get().then(function (makes) {
      data.utils.overwrite($scope.results.makes, makes);
    });
  }]);

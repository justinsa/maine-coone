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
      recalls: []
    };

    $scope.actions = {
      search: function () {
        $scope.page.current = 1;
        _.assign($scope.page.options, $scope.controls);

        data.api.recalls.count($scope.page.options).then(function (total) {
          $scope.page.total = total.count;
        });

        data.api.recalls.get($scope.page.options).then(function (recalls) {
          $scope.results.recalls.length = 0;
          $.merge($scope.results.recalls, recalls);
        });
      },

      page: function () {
        $scope.page.options.from = ($scope.page.current - 1) * $scope.page.options.limit;

        data.api.recalls.get($scope.page.options).then(function (recalls) {
          $scope.results.recalls.length = 0;
          $.merge($scope.results.recalls, recalls);
        });
      }
    };

    data.api.years.get().then(function (years) {
      $scope.results.years = years;
      $scope.controls.end = years[0];
      $scope.controls.start = years[years.length - 1];
      $scope.actions.search();
    });
    data.api.makes.get().then(function (makes) {
      $scope.results.makes = makes;
    });
  }]);

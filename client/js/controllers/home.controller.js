'use strict';
angular.module('application.controllers')
  .controller('HomeController', ['data', '$scope', function (data, $scope) {
    $scope.controls = {
      end: undefined,
      from: 0,
      limit: 25,
      makes: [],
      recalls: [],
      start: undefined,
      total: 0
    };
    $scope.results = {};

    data.api.years.get().then(function (years) {
      $scope.results.years = years;
      $scope.controls.end = years[0];
      $scope.controls.start = years[years.length - 1];
    });
    data.api.makes.get().then(function (makes) {
      $scope.results.makes = makes;
    });

    $scope.actions = {
      search: function () {
        $scope.page = {
          options: _.pick($scope.controls, 'end', 'limit', 'makes', 'start')
        };
        $scope.page.options.from = 0;
        $scope.page.current = 1;

        data.api.recalls.count($scope.page.options).then(function (total) {
          $scope.page.total = total;
        });

        data.api.recalls.get($scope.page.options).then(function (recalls) {
          $scope.results.recalls = recalls;
        });
      },

      page: function (number) {
        var total = $scope.page.total,
            limit = $scope.page.options.limit,
            pages = total / limit + (total % limit > 0 ? 1 : 0);
        number = (number < 1) ? 1 : number;
        number = (number > pages) ? pages : number;
        $scope.page.options.from = (number - 1) * limit;

        data.api.recalls.get($scope.page.options).then(function (recalls) {
          $scope.results.recalls = recalls;
        });
      }
    };

    $scope.$watch('page.current', function (newValue, oldValue) {
      if (newValue === oldValue || !_.isNumber(newValue)) {
        return;
      }
      $scope.actions.page(newValue);
    });
  }]);

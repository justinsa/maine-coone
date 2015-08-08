'use strict';
angular.module('application.filters')
  .filter('trust', ['$sce', function ($sce) {
    return function (html) {
      return $sce.trustAsHtml(html);
    };
  }]);
'use strict';
angular.module('application.filters')
  .filter('default', ['$sce', function ($sce) {
    return function (text) {
      return !_.isEmpty(text) ? text : $sce.trustAsHtml('<i>NO INFORMATION AVAILABLE</i>');
    };
  }]);
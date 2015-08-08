'use strict';
angular.module('application.filters')
  .filter('default', ['i18nextFilter', '$sce', function (i18nextFilter, $sce) {
    return function (text, fallback) {
      return !_.isEmpty(text) ? text : $sce.trustAsHtml(i18nextFilter(fallback));
    };
  }]);
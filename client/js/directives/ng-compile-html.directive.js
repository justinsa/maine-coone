'use strict';
angular.module('application.directives')
  .directive('ngCompileHtml', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(
          attrs.ngCompileHtml,
          function (newValue) {
            element.html(newValue);
            $compile(element.contents())(scope);
          }
        );
      }
    };
  }]);
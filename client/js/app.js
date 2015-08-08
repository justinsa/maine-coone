'use strict';
var application = angular.module('nhtsa', [
  'application.controllers',
  'application.directives',
  'application.filters',
  'application.services',
  'jm.i18next',
  'ngAnimate',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'restangular',
  'ui.bootstrap'
]);

application.config(['$i18nextProvider', function ($i18nextProvider) {
  $i18nextProvider.options = {
    lng: 'en',
    useCookie: false,
    useLocalStorage: false,
    fallbackLng: 'en',
    debug: true,
    ns: {
      defaultNs: 'translation',
      namespaces: ['translation']
    },
    resGetPath: '../locales/__lng__/__ns__.json'
  };
}]);
application.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);
application.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: 'partials/home.html', controller: 'HomeController' })
    .otherwise({ redirectTo: '/' });
}]);

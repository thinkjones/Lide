'use strict';

// Declare app level module which depends on views, and components
var lideApp = angular.module('lideApp', []).
config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('!');
}]);

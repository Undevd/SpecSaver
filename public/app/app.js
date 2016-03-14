angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})
        .when('/quote', { templateUrl: '/partials/quote/quote', controller: "mvQuoteCtrl" })
        .when('/vote/cast-vote', { templateUrl: '/partials/vote/cast-vote', controller: "mvVoteCtrl" })
        .when('/vote/display-results', { templateUrl: '/partials/vote/display-results', controller: "mvResultCtrl" })
        .when('/user-story/create-user-story', { templateUrl: '/partials/user-story/create-user-story', controller: "mvUserStoryCtrl" });
});
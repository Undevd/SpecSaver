angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})

        .when('/p', { templateUrl: '/partials/project/views/view-all-projects', controller: "ctrlViewAllProjects"})
        .when('/p/:projectCode', { templateUrl: '/partials/project/views/view-project', controller: "ctrlViewProject"})
        .when('/p/:projectCode/r', { templateUrl: '/partials/release/views/view-all-releases', controller: "ctrlViewAllReleases" })
        .when('/p/:projectCode/r/:releaseCode', { templateUrl: '/partials/release/views/view-release', controller: "ctrlViewRelease" })
        .when('/p/:projectCode/r/:releaseCode/f', { templateUrl: '/partials/feature/views/view-all-features', controller: "ctrlViewAllFeatures" })
        .when('/p/:projectCode/f', { templateUrl: '/partials/feature/views/view-all-features', controller: "ctrlViewAllFeatures" })
        .when('/p/:projectCode/f/:featureCode', { templateUrl: '/partials/feature/views/view-feature', controller: "ctrlViewFeature" })

        .when('/c/p', { templateUrl: '/partials/project/views/create-project', controller: "ctrlCreateProject"})
        .when('/c/p/:projectCode/r', { templateUrl: '/partials/release/views/create-release', controller: "ctrlCreateRelease" })
        .when('/c/p/:projectCode/r/:releaseCode/f', { templateUrl: '/partials/feature/views/create-feature', controller: "ctrlCreateFeature" })
        .when('/c/p/:projectCode/f', { templateUrl: '/partials/feature/views/create-feature', controller: "ctrlCreateFeature" })
        
        .when('/quote', { templateUrl: '/partials/quote/quote', controller: "mvQuoteCtrl" })
        .when('/test', { templateUrl: '/partials/test/test', controller: "mvTestCtrl"})
        .when('/testStep', { templateUrl: '/partials/testStep/testStep', controller: "mvTestStepCtrl"})
        .when('/user-story/create-user-story', { templateUrl: '/partials/user-story/create-user-story', controller: "mvUserStoryCtrl" })
        .when('/vote/cast-vote', { templateUrl: '/partials/vote/cast-vote', controller: "mvVoteCtrl" })
        .when('/vote/display-results', { templateUrl: '/partials/vote/display-results', controller: "mvResultCtrl" });
});
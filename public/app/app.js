angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})
        .when('/feature', { templateUrl: '/partials/feature/views/view-all-features', controller: "ctrlViewAllFeatures" })
        .when('/feature/create', { templateUrl: '/partials/feature/views/create-feature', controller: "ctrlCreateFeature" })
        .when('/feature/edit/:featureId', { templateUrl: 'partials/feature/views/view-feature', controller: "ctrlViewAllFeatures"})
        .when('/project/create', { templateUrl: '/partials/project/views/create-project', controller: "ctrlCreateProject"})
        .when('/project/:projectId', { templateUrl: '/partials/project/views/view-project', controller: "ctrlViewProject"})
        .when('/project', { templateUrl: '/partials/project/views/view-all-projects', controller: "ctrlViewAllProjects"})
        .when('/quote', { templateUrl: '/partials/quote/quote', controller: "mvQuoteCtrl" })
        .when('/release/create/:projectId', { templateUrl: '/partials/release/views/create-release', controller: "ctrlCreateRelease" })
        .when('/release/:projectId/:releaseId', { templateUrl: '/partials/release/views/view-release', controller: "ctrlViewRelease" })
        .when('/release/:projectId', { templateUrl: '/partials/release/views/view-all-releases', controller: "ctrlViewAllReleases" })
        .when('/test', { templateUrl: '/partials/test/test', controller: "mvTestCtrl"})
        .when('/testStep', { templateUrl: '/partials/testStep/testStep', controller: "mvTestStepCtrl"})
        .when('/user-story/create-user-story', { templateUrl: '/partials/user-story/create-user-story', controller: "mvUserStoryCtrl" })
        .when('/vote/cast-vote', { templateUrl: '/partials/vote/cast-vote', controller: "mvVoteCtrl" })
        .when('/vote/display-results', { templateUrl: '/partials/vote/display-results', controller: "mvResultCtrl" });
});
angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})
        .when('/quote', { templateUrl: '/partials/quote/quote', controller: "mvQuoteCtrl" })
        .when('/feature', { templateUrl: '/partials/feature/view-features', controller: "mvViewFeaturesCtrl" })
        .when('/feature/create', { templateUrl: '/partials/feature/create-feature', controller: "mvFeatureCtrl" })
        .when('/feature/edit/:featureId', { templateUrl: 'partials/feature/edit-features', controller: "mvViewFeaturesCtrl"})
        .when('/release/:projectId', { templateUrl: '/partials/release/view-all-releases', controller: "mvViewReleasesCtrl" })
        .when('/release/create/:projectId', { templateUrl: '/partials/release/create-release', controller: "mvReleaseCtrl" })
        .when('/vote/cast-vote', { templateUrl: '/partials/vote/cast-vote', controller: "mvVoteCtrl" })
        .when('/vote/display-results', { templateUrl: '/partials/vote/display-results', controller: "mvResultCtrl" })
        .when('/project', { templateUrl: '/partials/project/views/view-all-projects', controller: "ctrlViewAllProjects"})
        .when('/project/create', { templateUrl: '/partials/project/views/create-project', controller: "ctrlCreateProject"})
        .when('/project/:projectId', { templateUrl: '/partials/project/views/view-project', controller: "ctrlViewProject"})
        .when('/test', { templateUrl: '/partials/test/test', controller: "mvTestCtrl"})
        .when('/testStep', { templateUrl: '/partials/testStep/testStep', controller: "mvTestStepCtrl"})
        .when('/user-story/create-user-story', { templateUrl: '/partials/user-story/create-user-story', controller: "mvUserStoryCtrl" });
});
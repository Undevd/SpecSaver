angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})

        .when('/404', {templateUrl: 'partials/error/views/404', controller: 'ctrl404', title: '404'})

        .when('/p', { templateUrl: '/partials/project/views/view-all-projects', controller: "ctrlViewAllProjects", title: 'View all projects'})
        .when('/p/:projectCode', { templateUrl: '/partials/project/views/view-project', controller: "ctrlViewProject", title: 'View project'})
        .when('/p/:projectCode/r', { templateUrl: '/partials/release/views/view-all-releases', controller: "ctrlViewAllReleases", title: 'View all releases'})
        .when('/p/:projectCode/r/:releaseCode', { templateUrl: '/partials/release/views/view-release', controller: "ctrlViewRelease", title: 'View release'})
        .when('/p/:projectCode/r/:releaseCode/f', { templateUrl: '/partials/feature/views/view-release-features', controller: "ctrlViewReleaseFeatures", title: 'View release features'})
        .when('/p/:projectCode/f', { templateUrl: '/partials/feature/views/view-project-features', controller: "ctrlViewProjectFeatures" , title: 'View project features'})
        .when('/p/:projectCode/f/:featureCode', { templateUrl: '/partials/feature/views/view-feature', controller: "ctrlViewFeature", title: 'View feature'})
        .when('/p/:projectCode/f/:featureCode/u', { templateUrl: '/partials/user-story/views/view-feature-user-stories', controller: "ctrlViewFeatureUserStories", title: 'View feature user stories'})
        .when('/p/:projectCode/f/:featureCode/u/:userStoryCode', { templateUrl: '/partials/user-story/views/view-user-story', controller: "ctrlViewUserStory", title: 'View user story'})
        .when('/p/:projectCode/u', { templateUrl: '/partials/user-story/views/view-project-user-stories', controller: "ctrlViewProjectUserStories", title: 'View project user stories'})
        .when('/p/:projectCode/u/:userStoryCode', { templateUrl: '/partials/user-story/views/view-user-story', controller: "ctrlViewUserStory", title: 'View user story'})

        .when('/c/p', { templateUrl: '/partials/project/views/create-project', controller: "ctrlCreateProject", title: 'Create project'})
        .when('/c/p/:projectCode/r', { templateUrl: '/partials/release/views/create-release', controller: "ctrlCreateRelease", title: 'Create release'})
        .when('/c/p/:projectCode/r/:releaseCode/f', { templateUrl: '/partials/feature/views/create-feature', controller: "ctrlCreateFeature", title: 'Create feature'})
        .when('/c/p/:projectCode/f', { templateUrl: '/partials/feature/views/create-feature', controller: "ctrlCreateFeature", title: 'Create feature'})
        .when('/c/p/:projectCode/f/:featureCode/u', { templateUrl: '/partials/user-story/views/create-user-story', controller: "ctrlCreateUserStory", title: 'Create user story'})
        .when('/c/p/:projectCode/u', { templateUrl: '/partials/user-story/views/create-user-story', controller: "ctrlCreateUserStory", title: 'Create user story'})

        .when('/quote', { templateUrl: '/partials/quote/quote', controller: "mvQuoteCtrl", title: 'Create quote'})
        .when('/test', { templateUrl: '/partials/test/test', controller: "mvTestCtrl", title: 'Create test'})
        .when('/testStep', { templateUrl: '/partials/testStep/testStep', controller: "mvTestStepCtrl", title: 'Create test step'})
        .when('/vote/cast-vote', { templateUrl: '/partials/vote/cast-vote', controller: "mvVoteCtrl", title: 'Create vote'})
        .when('/vote/display-results', { templateUrl: '/partials/vote/display-results', controller: "mvResultCtrl", title: 'View results'});
});

angular.module('app').run(function($rootScope) {
    //Set the default title
    $rootScope.title = 'SpecSaver';

    //Set the title to that of the current route
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        if (current.$$route.title) {
            $rootScope.title = 'SpecSaver - ' + current.$$route.title;
        }
        else {
            $rootScope.title = 'SpecSaver';
        }
    });
});
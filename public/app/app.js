angular.module('app', ['ngResource', 'ngRoute', 'as.sortable']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})

        .when('/400', {templateUrl: 'partials/error/views/400', controller: 'ctrl400', title: 'Bad request'})
        .when('/404', {templateUrl: 'partials/error/views/404', controller: 'ctrl404', title: 'Page not found'})
        .when('/500', {templateUrl: 'partials/error/views/500', controller: 'ctrl500', title: 'Something went wrong'})
        .when('/501', {templateUrl: 'partials/error/views/501', controller: 'ctrl501', title: 'Not implemented'})

        .when('/p', {templateUrl: '/partials/project/views/view-all-projects', controller: "ctrlViewAllProjects", title: 'Projects'})
        .when('/p/:projectCode', {templateUrl: '/partials/project/views/view-project', controller: "ctrlViewProject", title: 'Project: '})
        .when('/p/:projectCode/a', {templateUrl: '/partials/acceptance-test/views/view-project-acceptance-tests', controller: "ctrlViewProjectAcceptanceTests", title: 'Acceptance Tests: '})
        .when('/p/:projectCode/f', {templateUrl: '/partials/feature/views/view-project-features', controller: "ctrlViewProjectFeatures" , title: 'Features: '})
        .when('/p/:projectCode/f/:featureCode', {templateUrl: '/partials/feature/views/view-feature', controller: "ctrlViewFeature", title: 'Feature: '})
        .when('/p/:projectCode/f/:featureCode/a', {templateUrl: '/partials/acceptance-test/views/view-feature-acceptance-tests', controller: "ctrlViewFeatureAcceptanceTests", title: 'Acceptance Tests: '})
        .when('/p/:projectCode/f/:featureCode/a/:acceptanceTestCode', {templateUrl: '/partials/acceptance-test/views/view-acceptance-test', controller: "ctrlViewAcceptanceTest", title: 'Acceptance Test: '})
        .when('/p/:projectCode/f/:featureCode/u', {templateUrl: '/partials/user-story/views/view-feature-user-stories', controller: "ctrlViewFeatureUserStories", title: 'User Stories: '})
        .when('/p/:projectCode/f/:featureCode/u/:userStoryCode', {templateUrl: '/partials/user-story/views/view-user-story', controller: "ctrlViewUserStory", title: 'User Story: '})
        .when('/p/:projectCode/r', {templateUrl: '/partials/release/views/view-all-releases', controller: "ctrlViewAllReleases", title: 'Releases: '})
        .when('/p/:projectCode/r/:releaseCode', {templateUrl: '/partials/release/views/view-release', controller: "ctrlViewRelease", title: 'Release: '})
        .when('/p/:projectCode/s', {templateUrl: '/partials/system-test/views/view-all-system-tests', controller: "ctrlViewAllSystemTests", title: 'System Tests: '})
        .when('/p/:projectCode/s/:systemTestCode', {templateUrl: '/partials/system-test/views/view-system-test', controller: "ctrlViewSystemTest", title: 'System Test: '})
        .when('/p/:projectCode/u', {templateUrl: '/partials/user-story/views/view-project-user-stories', controller: "ctrlViewProjectUserStories", title: 'User Stories: '})

        .when('/c/p', {templateUrl: '/partials/project/views/create-project', controller: "ctrlCreateProject", title: 'Create Project'})
        .when('/c/p/:projectCode/f', {templateUrl: '/partials/feature/views/create-feature', controller: "ctrlCreateFeature", title: 'Create Feature: '})
        .when('/c/p/:projectCode/f/:featureCode/a', {templateUrl: '/partials/acceptance-test/views/create-acceptance-test', controller: "ctrlCreateAcceptanceTest", title: 'Create Acceptance Test: '})
        .when('/c/p/:projectCode/f/:featureCode/u', {templateUrl: '/partials/user-story/views/create-user-story', controller: "ctrlCreateUserStory", title: 'Create User Story: '})
        .when('/c/p/:projectCode/r', {templateUrl: '/partials/release/views/create-release', controller: "ctrlCreateRelease", title: 'Create Release: '})
        .when('/c/p/:projectCode/s', {templateUrl: '/partials/system-test/views/create-system-test', controller: "ctrlCreateSystemTest", title: 'Create System Test: '})

        .when('/quote', {templateUrl: '/partials/quote/quote', controller: "mvQuoteCtrl", title: 'Create Quote'})
        .when('/vote/cast-vote', {templateUrl: '/partials/vote/cast-vote', controller: "mvVoteCtrl", title: 'Create Vote'})
        .when('/vote/display-results', {templateUrl: '/partials/vote/display-results', controller: "mvResultCtrl", title: 'View Results'})

        .otherwise({redirectTo: '/404'});
});

angular.module('app').run(function($rootScope, $location, identitySvc) {

    //Set the default title
    var defaultTitle = 'SpecSaver';

    //Set the title in the root scope
    $rootScope.title = defaultTitle;

    //When the route change is starting
    $rootScope.$on('$routeChangeStart', function(event, current, previous) {

        //If the current user is not logged in
        if (!identitySvc.currentUser) {

            //TEMP: Disabled for development purposes so that you don't need to keep logging in
            
            //Redirect them to the home page to log in
            //$location.path('/');

            return;
        }
    });

    //When the route change has finished successfully
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {

        //If the current route exists and it has a title
        if (current.$$route && current.$$route.title) {

            //Append the route title after the default title
            $rootScope.title = defaultTitle + ': ' + current.$$route.title;
        }
        else {
            
            //Otherwise, set the title to the default
            $rootScope.title = defaultTitle;
        }
    });
});
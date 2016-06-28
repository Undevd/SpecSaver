angular.module('app').controller('ctrlViewProjectUserStories', function($scope, $rootScope, $routeParams, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Set the navigation settings
    $scope.nav = {
        userStory: {isCurrentSection: true},
    };

    //Get the project associated with the user stories
    dbProject.getProject(projectCode).$promise.then(function(data) {

    	//Store the data in the scope
    	$scope.project = data.project;
    	$scope.stats = data.stats;
    });
});
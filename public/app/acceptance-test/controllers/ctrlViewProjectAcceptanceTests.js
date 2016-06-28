angular.module('app').controller('ctrlViewProjectAcceptanceTests', function($scope, $rootScope, $routeParams, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Set the navigation settings
    $scope.nav = {
        acceptanceTest: {isCurrentSection: true},
    };

    //Get the project associated with the acceptance tests
    dbProject.getProject(projectCode).$promise.then(function(data) {

    	//Store the data in the scope
    	$scope.project = data.project;
    	$scope.stats = data.stats;
    });
});
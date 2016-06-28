angular.module('app').controller('ctrlViewAllProjects', function($scope, dbProject) {

    //Set the navigation settings
    $scope.nav = {
        project: {isCurrentSection: true},
    };

	//Get all projects
    dbProject.getAllProjects().$promise.then(function(projects) {

    	//Store the projects in the scope
    	$scope.projects = projects;
    	
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
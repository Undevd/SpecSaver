angular.module('app').controller('ctrlViewAllProjects', function($scope, $location, dbProject) {

    //Set the navigation settings
    $scope.nav = {
        project: {isCurrentSection: true},
    };

	//Get all projects
    dbProject.getAllProjects().$promise.then(function(projects) {

    	//Store the projects in the scope
    	$scope.projects = projects;

        //Set the clickable row URL function
        $scope.goTo = function(projectCode) {
            $location.path('/p/' + projectCode);
        };
    	
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
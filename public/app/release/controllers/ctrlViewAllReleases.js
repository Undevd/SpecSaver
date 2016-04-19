angular.module('app').controller('ctrlViewAllReleases', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    
	//Set the page title
    $rootScope.title += projectCode;

    //Get the releases associated with the project
    dbRelease.getAllReleases(projectCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.releases = data.releases;

    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
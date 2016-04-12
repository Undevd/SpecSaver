angular.module('app').controller('ctrlViewAllReleases', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    
	//Set the page title
    $rootScope.title += projectCode;

    //Get data related to the releases
    dbRelease.getAllReleases(projectCode).$promise.then(function(data) {

        //Store the releases in the scope
        $scope.releases = data.releases;

        //Store the project in the scope
        $scope.project = data.project;

    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
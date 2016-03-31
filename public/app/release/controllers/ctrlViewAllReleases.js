angular.module('app').controller('ctrlViewAllReleases', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;
    
	//Set the page title
    $rootScope.title += projectCode;

    $scope.project = dbProject.getProject(projectCode);

    $scope.releases = dbRelease.getAllReleases(projectCode);
});
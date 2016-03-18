angular.module('app').controller('ctrlViewProject', function($scope, $routeParams, dbProject, dbRelease) {
    
	$scope.project = dbProject.getProject($routeParams.projectId);

	$scope.release = dbRelease.getAllReleasesCount($routeParams.projectId);
});
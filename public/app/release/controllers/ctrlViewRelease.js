angular.module('app').controller('ctrlViewRelease', function($scope, $routeParams, dbProject, dbRelease) {
    
	var projectId = $routeParams.projectId;
	var releaseId = $routeParams.releaseId;

	$scope.project = dbProject.getProject(projectId);

	$scope.release = dbRelease.getRelease(projectId, releaseId);
});
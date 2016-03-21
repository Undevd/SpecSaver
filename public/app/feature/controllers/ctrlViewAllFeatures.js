angular.module('app').controller('ctrlViewAllFeatures', function($scope, $routeParams, dbFeature, dbProject, dbRelease) {
    
    var projectId = $routeParams.projectId;
    var releaseId = $routeParams.releaseId;

    $scope.features = dbFeature.getAllFeatures(projectId, releaseId);

    $scope.project = dbProject.getProject(projectId);

    if (releaseId)
    {
    	$scope.release = dbRelease.getRelease(projectId, releaseId);	
    }
});
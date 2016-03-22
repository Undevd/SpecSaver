angular.module('app').controller('ctrlViewAllFeatures', function($scope, $routeParams, dbFeature, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;
    var releaseId = $routeParams.releaseId;

    $scope.features = dbFeature.getAllFeatures(projectCode, releaseId);

    $scope.project = dbProject.getProject(projectCode);

    if (releaseId)
    {
    	$scope.release = dbRelease.getRelease(projectCode, releaseId);	
    }
});
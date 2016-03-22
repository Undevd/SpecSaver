angular.module('app').controller('ctrlViewAllFeatures', function($scope, $routeParams, dbFeature, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;
    var releaseCode = $routeParams.releaseCode;

    $scope.features = dbFeature.getAllFeatures(projectCode, releaseCode);

    $scope.project = dbProject.getProject(projectCode);

    if (releaseCode)
    {
    	$scope.release = dbRelease.getRelease(projectCode, releaseCode);	
    }
});
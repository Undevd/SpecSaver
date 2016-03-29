angular.module('app').controller('ctrlViewReleaseFeatures', function($scope, $routeParams, dbFeature, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;
    var releaseCode = $routeParams.releaseCode;

    $scope.features = dbFeature.getAllFeatures(projectCode, releaseCode);

    $scope.project = dbProject.getProject(projectCode);

    $scope.release = dbRelease.getRelease(projectCode, releaseCode);
});
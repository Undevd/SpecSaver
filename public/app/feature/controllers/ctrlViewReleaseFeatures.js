angular.module('app').controller('ctrlViewReleaseFeatures', function($scope, $rootScope, $routeParams, dbFeature, dbProject, dbRelease) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var releaseCode = $routeParams.releaseCode;

	//Set the page title
    $rootScope.title += projectCode + '.' + releaseCode;

    //Get the features associated with the release
    $scope.features = dbFeature.getAllFeatures(projectCode, releaseCode);

    //Get the project data
    $scope.project = dbProject.getProject(projectCode);

    //Get the release data
    $scope.release = dbRelease.getRelease(projectCode, releaseCode);
});
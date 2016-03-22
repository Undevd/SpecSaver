angular.module('app').controller('ctrlViewAllReleases', function($scope, $location, $routeParams, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;
    
    $scope.project = dbProject.getProject(projectCode);

    $scope.releases = dbRelease.getAllReleases(projectCode);
});
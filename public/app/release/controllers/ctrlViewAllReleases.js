angular.module('app').controller('ctrlViewAllReleases', function($scope, $location, $routeParams, dbProject, dbRelease) {
    
    var projectId = $routeParams.projectId;
    
    $scope.project = dbProject.getProject(projectId);

    $scope.releases = dbRelease.getAllReleases(projectId);
});
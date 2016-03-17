angular.module('app').controller('ctrlViewAllReleases', function($scope, $location, $routeParams, dbRelease) {
    
    $scope.projectId = $routeParams.projectId;
    
    $scope.releases = dbRelease.getAllReleases($scope.projectId);
});
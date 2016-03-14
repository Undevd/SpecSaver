angular.module('app').controller('mvViewReleasesCtrl', function($scope, $location, $routeParams, dbOps) {
    $scope.projectId = $routeParams.projectId;
    $scope.releases = dbOps.viewReleases();
});
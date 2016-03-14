angular.module('app').controller('mvViewReleasesCtrl', function($scope, $location, dbOps) {
    $scope.releases = dbOps.viewReleases();

    console.log($scope.releases);
});
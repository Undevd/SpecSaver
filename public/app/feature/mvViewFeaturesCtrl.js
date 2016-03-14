angular.module('app').controller('mvViewFeaturesCtrl', function($scope, $location, dbOps) {
    $scope.features = dbOps.viewFeatures();

    console.log($scope.features);
});
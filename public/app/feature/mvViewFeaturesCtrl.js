angular.module('app').controller('mvViewFeaturesCtrl', function($scope, $location, $routeParams, dbOps, mvFeature) {
    $scope.features = dbOps.viewFeatures();
    $scope.featureId = $routeParams.featureId;
    $scope.feature = mvFeature.query({id: $scope.featureId});
    console.log($scope.features);
    console.log($scope.featureId);
    console.log($scope.feature);   
    
});
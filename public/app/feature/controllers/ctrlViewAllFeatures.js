angular.module('app').controller('ctrlViewAllFeatures', function($scope, dbFeature) {
    
    $scope.features = dbFeature.getAllFeatures();
});
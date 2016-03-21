angular.module('app').controller('ctrlCreateFeature', function($scope, $window, $location, dbOps) {
    $scope.create = function() {
        var newFeature = {
            name: $scope.name,
            description: $scope.description
        };
        
        dbOps.createFeature(newFeature).then(function(feature) {
            $location.path = '/p/' + feature.productId + '/f/' + feature._id;
        }, function(reason) {
            console.log("failed to add feature");
        });
    }
});
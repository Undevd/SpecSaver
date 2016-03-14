angular.module('app').controller('mvFeatureCtrl', function($scope, $window, $location, dbOps) {
    $scope.create = function() {
        var newFeature = {
            name: $scope.name,
            description: $scope.description
        };
        
        // dbOps.createFeature(newFeature).then(function() {
        //     $location.path = '/';
        // }, function(reason) {
        //     console.log("failed to add feature");
        // });

        dbOps.createFeature(newFeature);

        $location.path = '/feature';
    }
});
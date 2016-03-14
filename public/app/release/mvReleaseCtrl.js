angular.module('app').controller('mvReleaseCtrl', function($scope, $location, dbOps) {
    
    $scope.products = dbOps.viewReleases();
    
	$scope.submit = function() {
        var newRelease = {
            name: $scope.name,
            description: $scope.description
        };
        
        dbOps.createRelease(newRelease).then(function() {
            $location.path('/');
        }, function(reason) {
            console.log("failed to add release");
        });
    }
});
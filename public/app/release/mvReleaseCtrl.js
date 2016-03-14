angular.module('app').controller('mvReleaseCtrl', function($scope, $location, dbOps) {
	$scope.submit = function() {
        var newRelease = {
            name: $scope.name,
            description: $scope.description
        };
        
        // dbOps.createRelease(newRelease).then(function() {
        //     $location.path('/');
        // }, function(reason) {
        //     console.log("failed to add release");
        // });
        
        dbOps.createRelease(newRelease);

        $location.path('/release');
    }
});
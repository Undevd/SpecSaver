angular.module('app').controller('mvReleaseCtrl', function($scope, $location, $routeParams, dbOps) {
    $scope.projectId = $routeParams.projectId;
    console.log($scope.projectId);
	$scope.submit = function() {
        var newRelease = {
            name: $scope.name,
            description: $scope.description,
            project: $scope.projectId
        };
        
        dbOps.createRelease(newRelease).then(function() {
          $location.path('/release');
        }, function(reason) {
           console.log("failed to add release");
        });
    }
});
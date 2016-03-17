angular.module('app').controller('ctrlCreateRelease', function($scope, $location, $routeParams, dbRelease) {
    
    $scope.projectId = $routeParams.projectId;

	$scope.submit = function() {
        var newRelease = {
            name: $scope.name,
            description: $scope.description,
            projectId: $scope.projectId
        };
        
        dbRelease.createRelease(newRelease).then(function() {
          $location.path('/release');
        }, function(reason) {
           console.log("failed to add release");
        });
    }
});
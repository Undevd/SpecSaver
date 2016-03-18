angular.module('app').controller('ctrlCreateRelease', function($scope, $location, $routeParams, dbProject, dbRelease) {
    
    var projectId = $routeParams.projectId;

    $scope.project = dbProject.getProject(projectId);

	$scope.submit = function() {
        var newRelease = {
            name: $scope.name,
            description: $scope.description,
            projectId: projectId
        };
        
        dbRelease.createRelease(newRelease).then(function(release) {
          $location.path('/release/' + projectId + '/' + release._id);
        }, function(reason) {
           console.log("failed to add release");
        });
    }
});
angular.module('app').controller('ctrlCreateRelease', function($scope, $location, $routeParams, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;

    $scope.project = dbProject.getProject(projectCode);

	$scope.submit = function() {
        var newRelease = {
            name: $scope.name,
            code: $scope.code,
            description: $scope.description,
            projectCode: projectCode
        };

        dbRelease.createRelease(newRelease).then(function(release) {
          $location.path('/p/' + projectCode + '/r/' + release.code);
        }, function(reason) {
           console.log("failed to add release");
        });
    }
});
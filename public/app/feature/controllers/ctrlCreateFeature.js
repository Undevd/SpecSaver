angular.module('app').controller('ctrlCreateFeature', function($scope, $routeParams, $location, dbFeature, dbProject, dbRelease) {
    
    var projectId = $routeParams.projectId;
    var releaseId = $routeParams.releaseId;

    $scope.project = dbProject.getProject(projectId);

    if (releaseId)
    {
        $scope.release = dbRelease.getRelease(projectId, releaseId);    
    }

    $scope.create = function() {
        var newFeature = {
            name: $scope.name,
            description: $scope.description,
            projectId: projectId
        };

        dbFeature.createFeature(newFeature).then(function(feature) {
            $location.path('/p/' + feature.projectId + '/f/' + feature._id);
        }, function(reason) {
            console.log("failed to add feature");
        });
    }
});
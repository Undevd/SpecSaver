angular.module('app').controller('ctrlCreateFeature', function($scope, $routeParams, $location, dbFeature, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;
    var releaseId = $routeParams.releaseId;

    $scope.project = dbProject.getProject(projectCode);

    if (releaseId)
    {
        $scope.release = dbRelease.getRelease(projectCode, releaseId);    
    }

    $scope.create = function() {
        var newFeature = {
            name: $scope.name,
            description: $scope.description,
            projectCode: projectCode
        };

        dbFeature.createFeature(newFeature).then(function(feature) {
            $location.path('/p/' + feature.projectCode + '/f/' + feature._id);
        }, function(reason) {
            console.log("failed to add feature");
        });
    }
});
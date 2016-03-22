angular.module('app').controller('ctrlCreateFeature', function($scope, $routeParams, $location, dbFeature, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;
    var releaseCode = $routeParams.releaseCode;

    $scope.project = dbProject.getProject(projectCode);

    if (releaseCode)
    {
        $scope.release = dbRelease.getRelease(projectCode, releaseCode);    
    }

    $scope.create = function() {
        var newFeature = {
            name: $scope.name,
            code: $scope.code,
            description: $scope.description,
            projectCode: projectCode
        };

        dbFeature.createFeature(newFeature).then(function(feature) {
            $location.path('/p/' + feature.projectCode + '/f/' + feature.code);
        }, function(reason) {
            console.log("failed to add feature");
        });
    }
});
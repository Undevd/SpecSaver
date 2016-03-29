angular.module('app').controller('ctrlViewProjectFeatures', function($scope, $routeParams, dbFeature, dbProject) {
    
    var projectCode = $routeParams.projectCode;

    $scope.features = dbFeature.getAllFeatures(projectCode);

    $scope.project = dbProject.getProject(projectCode);
});
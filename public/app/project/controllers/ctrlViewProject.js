angular.module('app').controller('ctrlViewProject', function($scope, $routeParams, dbProject) {
    
    $scope.project = dbProject.getProject($routeParams.projectId);
});
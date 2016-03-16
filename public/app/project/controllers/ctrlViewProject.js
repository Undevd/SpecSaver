angular.module('app').controller('ctrlViewProject', function($scope, $routeParams, dbProject) {
    
	$scope.projects = dbProject.getProject($routeParams.projectId);
});
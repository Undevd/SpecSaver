angular.module('app').controller('ctrlViewAllProjects', function($scope, dbProject) {
	
    $scope.projects = dbProject.getAllProjects();
});
angular.module('app').controller('ctrlViewProject', function($scope, $routeParams, dbProject, dbRelease) {
    
	//Data related to the project
	$scope.project = dbProject.getProject($routeParams.projectCode);

	//Get the number of releases associated with the project
	$scope.release = dbRelease.getAllReleasesCount($routeParams.projectCode);

	//Record whether a field is being edited
	$scope.edit = {};

	//Store the old value of a field as it is being edited
	$scope.oldData = {};

	$scope.showEdit = function(field, show) {
        if (show) {
	        //Store the old data
	        $scope.oldData[field] = $scope.project[field];
    	}

        //Show the edit fields
        $scope.edit[field] = show;
    }

    $scope.cancelEdit = function(field) {
    	//Reset the value
    	$scope.project[field] = $scope.oldData[field];

    	//Stop editing
    	$scope.showEdit(field, false);
    }

    $scope.submitEdit = function(field) {
    	//Save the project
    	dbProject.updateProject($scope.project);

    	//Stop editing
    	$scope.showEdit(field, false);
    }
});
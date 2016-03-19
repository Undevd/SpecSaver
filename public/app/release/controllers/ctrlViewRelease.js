angular.module('app').controller('ctrlViewRelease', function($scope, $routeParams, dbProject, dbRelease) {
    
	//Get the project and release IDs from the route
	var projectId = $routeParams.projectId;
	var releaseId = $routeParams.releaseId;

	//Data related to the project that the release is associated with
	$scope.project = dbProject.getProject(projectId);

	//Data related to the release
	$scope.release = dbRelease.getRelease(projectId, releaseId);

	//Record whether a field is being edited
	$scope.edit = {};

	//Store the old value of a field as it is being edited
	$scope.oldData = {};

	$scope.showEdit = function(field, show) {
        if (show) {
	        //Store the old data
	        $scope.oldData[field] = $scope.release[field];
    	}

        //Show the edit fields
        $scope.edit[field] = show;
    }

    $scope.cancelEdit = function(field) {
    	//Reset the value
    	$scope.release[field] = $scope.oldData[field];

    	//Stop editing
    	$scope.showEdit(field, false);
    }

    $scope.submitEdit = function(field) {
    	//Save the release
    	dbRelease.updateRelease($scope.release);

    	//Stop editing
    	$scope.showEdit(field, false);
    }
});
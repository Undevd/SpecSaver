angular.module('app').controller('ctrlViewRelease', function($scope, $routeParams, dbProject, dbRelease) {
    
	//Get the project and release IDs from the route
	var projectCode = $routeParams.projectCode;
	var releaseCode = $routeParams.releaseCode;

	//Data related to the project that the release is associated with
	$scope.project = dbProject.getProject(projectCode);

	//Data related to the release
	$scope.release = dbRelease.getRelease(projectCode, releaseCode);

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
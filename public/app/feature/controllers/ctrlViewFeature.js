angular.module('app').controller('ctrlViewFeature', function($scope, $routeParams, dbFeature, dbProject) {
    
	//Get the project and feature IDs from the route
	var projectCode = $routeParams.projectCode;
	var featureCode = $routeParams.featureCode;

	//Data related to the project that the feature is associated with
	$scope.project = dbProject.getProject(projectCode);

	//Data related to the feature
	$scope.feature = dbFeature.getFeature(projectCode, featureCode);

	//Record whether a field is being edited
	$scope.edit = {};

	//Store the old value of a field as it is being edited
	$scope.oldData = {};

	$scope.showEdit = function(field, show) {
        if (show) {
	        //Store the old data
	        $scope.oldData[field] = $scope.feature[field];
    	}

        //Show the edit fields
        $scope.edit[field] = show;
    }

    $scope.cancelEdit = function(field) {
    	//Reset the value
    	$scope.feature[field] = $scope.oldData[field];

    	//Stop editing
    	$scope.showEdit(field, false);
    }

    $scope.submitEdit = function(field) {
    	console.log($scope.feature);
        //Save the feature
    	dbFeature.updateFeature($scope.feature);

    	//Stop editing
    	$scope.showEdit(field, false);
    }
});
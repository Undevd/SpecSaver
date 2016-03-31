angular.module('app').controller('ctrlViewUserStory', function($scope, $rootScope, $routeParams, dbFeature, dbProject, dbUserStory) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var featureCode = $routeParams.featureCode;
    var userStoryCode = $routeParams.userStoryCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode + '-' + userStoryCode;

	//Data related to the project that the user story is associated with
	$scope.project = dbProject.getProject(projectCode);

	//Data related to the project that the user story is associated with
	$scope.feature = dbFeature.getFeature(projectCode, featureCode);

    //Data related to the user story
    $scope.userStory = dbUserStory.getUserStory(projectCode, featureCode, userStoryCode);

	//Record whether a field is being edited
	$scope.edit = {};

	//Store the old value of a field as it is being edited
	$scope.oldData = {};

	$scope.showEdit = function(field, show) {
        if (show) {
	        //Store the old data
	        $scope.oldData[field] = $scope.userStory[field];
    	}

        //Show the edit fields
        $scope.edit[field] = show;
    }

    $scope.cancelEdit = function(field) {
    	//Reset the value
    	$scope.userStory[field] = $scope.oldData[field];

    	//Stop editing
    	$scope.showEdit(field, false);
    }

    $scope.submitEdit = function(field) {
        console.log($scope.userStory);
        //Save the user story
    	dbUserStory.updateUserStory($scope.userStory);

    	//Stop editing
    	$scope.showEdit(field, false);
    }
});
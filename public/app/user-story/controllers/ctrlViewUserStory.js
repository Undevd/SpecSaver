angular.module('app').controller('ctrlViewUserStory', function($scope, $rootScope, $routeParams, dbUserStory) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var featureCode = $routeParams.featureCode;
    var userStoryCode = $routeParams.userStoryCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode + '-' + userStoryCode;

    //Get the user story data
    dbUserStory.getUserStory(projectCode, featureCode, userStoryCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.feature = data.feature;
        $scope.userStory = data.userStory;
        
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });

	//Record whether a field is being edited
	$scope.edit = {};

	//Store the old value of a field as it is being edited
	$scope.oldData = {};

    //Shows or hides the form used to edit the field
	$scope.showEdit = function(field, show) {

        //If the form should be shown
        if (show) {

	        //Store the old data
	        $scope.oldData[field] = $scope.userStory[field];
    	}

        //Show the edit fields
        $scope.edit[field] = show;
    }

    //Cancels editing the field and hides the form
    $scope.cancelEdit = function(field) {

    	//Reset the value
    	$scope.userStory[field] = $scope.oldData[field];

    	//Stop editing
    	$scope.showEdit(field, false);
    }

    //Submits the edits made to the field to the server
    $scope.submitEdit = function(field) {

        //Save the user story
    	dbUserStory.updateUserStory($scope.userStory);

    	//Stop editing
    	$scope.showEdit(field, false);
    }
});
angular.module('app').controller('ctrlViewRelease', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var releaseCode = $routeParams.releaseCode;

    //Set the page title
    $rootScope.title += projectCode + '.' + releaseCode;

	//Get the release data
	dbRelease.getRelease(projectCode, releaseCode).$promise.then(function(data) {
        
        //Store the data in the scope
        $scope.project = data.project;
        $scope.release = data.release;

        //Record whether a field is being edited
        $scope.edit = {};

        //Store the old value of a field as it is being edited
        $scope.oldData = {};

        //Shows or hides the form used to edit the field
        $scope.showEdit = function(field, show) {

            //If the form should be shown
            if (show) {

                //Store the old data
                $scope.oldData[field] = $scope.release[field];
            }

            //Show the edit fields
            $scope.edit[field] = show;
        }

        //Cancels editing the field and hides the form
        $scope.cancelEdit = function(field) {

            //Reset the value
            $scope.release[field] = $scope.oldData[field];

            //Stop editing
            $scope.showEdit(field, false);
        }

        //Submits the edits made to the field to the server
        $scope.submitEdit = function(field) {
            
            //Save the release
            dbRelease.updateRelease($scope.release);

            //Stop editing
            $scope.showEdit(field, false);
        }
    }, function(error) {

        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
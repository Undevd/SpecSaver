angular.module('app').controller('ctrlViewRelease', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var releaseCode = $routeParams.releaseCode;

    //Set the page title
    $rootScope.title += projectCode + '.' + releaseCode;

	//Get data related to the release
	dbRelease.getRelease(projectCode, releaseCode).$promise.then(function(data) {
        
        //Store the release in the scope
        $scope.release = data.release;

        //Store the project in the scope
        $scope.project = data.project;

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
    }, function(error) {

        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
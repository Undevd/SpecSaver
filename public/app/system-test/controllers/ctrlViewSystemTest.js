angular.module('app').controller('ctrlViewSystemTest', function($scope, $rootScope, $location, $routeParams, dbSystemTest, dbTestStep) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var systemTestCode = $routeParams.systemTestCode;

    //Set the page title
    $rootScope.title += projectCode + '-S' + systemTestCode;

    //Get the systemTest data
    dbSystemTest.getSystemTest(projectCode, systemTestCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.systemTest = data.systemTest;
        $scope.stats = data.stats;

        //Record whether a field is being edited
        $scope.edit = {};

        //Store the old value of a field as it is being edited
        $scope.oldData = {};

        //Shows or hides the form used to edit the field
        $scope.showEdit = function(field, show) {

            //If the form should be shown
            if (show) {

                //Store the old data
                $scope.oldData[field] = $scope.systemTest[field];
            }

            //Show the edit fields
            $scope.edit[field] = show;
        };

        //Cancels editing the field and hides the form
        $scope.cancelEdit = function(field) {

            //Reset the value
            $scope.systemTest[field] = $scope.oldData[field];

            //Stop editing
            $scope.showEdit(field, false);
        };

        //Submits the edits made to the field to the server
        $scope.submitEdit = function(field) {

            //Save the system test
            dbSystemTest.updateSystemTest($scope.systemTest);

            //Stop editing
            $scope.showEdit(field, false);
        };

        //Store test step search results
        $scope.$searchResults = [{}];

        //Searches for matching steps
        $scope.searchForTestStep = function() {

            //Search for a match
            dbTestStep.searchForTestStep(projectCode, $scope.type, $scope.step).$promise.then(function(results) {

                //Add the search results to the scope
                $scope.searchResults = results;
            });
        }
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
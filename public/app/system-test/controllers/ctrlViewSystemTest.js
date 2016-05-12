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
        $scope.testSteps = data.testSteps;
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
        $scope.searchResults = [];

        //Searches for matching steps
        $scope.searchForTestStep = function() {

            //Search for a match
            dbTestStep.searchForTestStep(projectCode, $scope.newTestStep.type, $scope.newTestStep.step).$promise.then(function(results) {

                //Add the search results to the scope
                $scope.searchResults = results;

                //Set the current time
                $scope.searchResultsTime = new Date();
            });
        };

        //Store data on new test steps which are added
        $scope.newTestStep = {};

        //Clears the test step search window and sets the new test step position to the end of the list
        $scope.clearTestStepSearch = function() {

            //If a test step was selected previously
            if ($scope.newTestStep.code) {

                //Clear all the form fields
                $scope.newTestStep = {};

                //Clear the search results
                $scope.searchResults = [];

                //Clear the search time
                $scope.searchResultsTime = null;
            }

            //Set the position to be at the end of the list
            $scope.newTestStep.position = $scope.testSteps.length;
        };

        //Sets the new test step position
        $scope.setTestStepPosition = function(position) {

            //Set the position
            $scope.newTestStep.position = position;
        };

        //Adds a test step to the system test
        $scope.addTestStep = function() {

            //Get the test step data from the scope
            var testStep = {
                code: $scope.newTestStep.code,
                position: $scope.newTestStep.position,
                projectCode: projectCode,
                systemTestCode: systemTestCode
            };

            //Add the test step
            dbTestStep.addTestStep(testStep).$promise.then(function(data) {

                //Clear any existing errors
                $scope.testStepError = null;

                //Store the updated data in the scope
                $scope.systemTest = data.systemTest;
                $scope.testSteps = data.testSteps;
                
                //Close the dialog (JQuery)
                $("#ModalAddCloseButton").trigger('click');

            }, function(error) {

                //Add the error message to the scope
                $scope.testStepError = error.data.message;
            });
        };

        //Creates a test step and adds it to the system test
        $scope.createTestStep = function() {

            //Get the test step data from the scope
            var testStep = {
                code: null,
                type: $scope.newTestStep.type,
                step: $scope.newTestStep.step,
                projectCode: projectCode
            };

            //Create the test step
            dbTestStep.createTestStep(testStep).then(function(data) {

                //Clear any existing errors
                $scope.testStepError = null;
                
                //Store the new test step code in the scope
                $scope.newTestStep.code = data.code;

                //Add the step to the system test
                $scope.addTestStep();

            }, function(error) {

                //Add the error message to the scope
                $scope.testStepError = error.data.message;
            });
        };
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
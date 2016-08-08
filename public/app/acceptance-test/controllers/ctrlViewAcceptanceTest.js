angular.module('app').controller('ctrlViewAcceptanceTest', function($scope, $rootScope, $location, $routeParams, dbAcceptanceTest, dbUserStory) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var featureCode = $routeParams.featureCode;
    var acceptanceTestCode = $routeParams.acceptanceTestCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode + '#A' + acceptanceTestCode;

    //Set the navigation settings
    $scope.nav = {
        acceptanceTest: {isCurrentSection: true},
        userStory: {edit: true}
    };

    //Get the acceptance test data
    dbAcceptanceTest.getAcceptanceTest(projectCode, featureCode, acceptanceTestCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.feature = data.feature;
        $scope.acceptanceTest = data.acceptanceTest;
        $scope.userStories = data.userStories;
        $scope.systemTests = data.systemTests;
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
                $scope.oldData[field] = $scope.acceptanceTest[field];
            }

            //Show the edit fields
            $scope.edit[field] = show;
        };

        //Cancels editing the field and hides the form
        $scope.cancelEdit = function(field) {

            //Reset the value
            $scope.acceptanceTest[field] = $scope.oldData[field];

            //Stop editing
            $scope.showEdit(field, false);
        };

        //Submits the edits made to the field to the server
        $scope.submitEdit = function(field) {

            //Save the acceptance test
            dbAcceptanceTest.updateAcceptanceTest($scope.acceptanceTest);

            //Stop editing
            $scope.showEdit(field, false);
        };

        //Store user story search results
        $scope.userStoryResults = [];

        //Searches for matching user stories
        $scope.searchForUserStory = function() {

            //Search for a match
            dbUserStory.searchForUserStory(projectCode, $scope.newUserStory.criteria).$promise.then(function(results) {

                //Clear any old error messages
                $scope.userStoryError = null;
                
                //Add the search results to the scope
                $scope.userStoryResults = results;

                //Set the current time
                $scope.userStoryResultsTime = new Date();

            }, function(error) {

                //Add the error message to the scope
                $scope.userStoryError = error.data.message;
            });
        };

        //Store data on new user stories which are added
        $scope.newUserStory = {};

        //Clears the user story search window
        $scope.clearUserStoryResults = function() {
            
            //Clear the last selected user story
            $scope.newUserStory.index = null;
            
            //Clear the search results
            $scope.userStoryResults = [];

            //Clear the search time
            $scope.userStoryResultsTime = null;
        };

        //Adds an user story to the acceptance test
        $scope.addUserStory = function(closeOnCompletion) {

            //Get the selected user story index
            var index = $scope.newUserStory.index;

            //Get the user story data from the scope
            var userStory = $scope.userStoryResults[index];

            //If the list of acceptance test user story codes doesn't exist
            if (!$scope.acceptanceTest.userStoryCodes) {
                
                //Create it
                $scope.acceptanceTest.userStoryCodes = [];
            }

            //If the list of user stories doesn't exist
            if (!$scope.userStories) {
                
                //Create it
                $scope.userStories = [];
            }

            //If the code doesn't exist in the user story codes list
            if ($scope.acceptanceTest.userStoryCodes.indexOf(userStory.code) < 0) {

                //Add the user story code to the acceptance test list
                $scope.acceptanceTest.userStoryCodes.push(userStory.code);

                //Add the user story to the user story list
                $scope.userStories.push({
                    code: userStory.code,
                    featureCode: userStory.featureCode,
                    projectCode: $scope.project.code
                });

                //Save the acceptance test
                dbAcceptanceTest.updateAcceptanceTest($scope.acceptanceTest).$promise.then(function(data) {
                    
                    //Clear any existing errors
                    $scope.userStoryError = null;
                    
                    //If the dialog should be closed on completion
                    if (closeOnCompletion) {
                        
                        //Close the dialog (JQuery)
                        $("#ModalAddUserStoryCloseButton").trigger('click');
                    }
                }, function(error) {

                    //Add the error message to the scope
                    $scope.userStoryError = error.data.message;
                });
            }
        };

        //Removes an user story from the acceptance test
        $scope.removeUserStory = function(code) {

            //For each user story code
            for (var i = 0; i < $scope.acceptanceTest.userStoryCodes.length; i++) {
                
                //If the user story code matches the supplied code
                if ($scope.acceptanceTest.userStoryCodes[i] == code) {

                    //Remove it from the array of user stories
                    $scope.acceptanceTest.userStoryCodes.splice(i, 1);

                    //Break from the loop
                    break;
                }
            }
            
            //For each user story
            for (var i = 0; i < $scope.userStories.length; i++) {
                
                //If the user story code matches the supplied code
                if ($scope.userStories[i].code == code) {

                    //Remove it from the array of user stories
                    $scope.userStories.splice(i, 1);

                    //Break from the loop
                    break;
                }
            }

            //Save the acceptance test
            dbAcceptanceTest.updateAcceptanceTest($scope.acceptanceTest).$promise.then(function(data) {
                
                //Clear any existing errors
                $scope.userStoryError = null;

            }, function(error) {

                //Add the error message to the scope
                $scope.userStoryError = error.data.message;
            });
        };
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
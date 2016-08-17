angular.module('app').controller('ctrlViewSystemTest', function($scope, $rootScope, $location, $routeParams, dbAcceptanceTest, dbSystemTest, dbStep) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var systemTestCode = $routeParams.systemTestCode;

    //Set the page title
    $rootScope.title += projectCode + '#S' + systemTestCode;

    //Set the navigation settings
    $scope.nav = {
        acceptanceTest: {edit: true},
        systemTest: {isCurrentSection: true}
    };

    //Formats a string into a placeholder value
    var formatPlaceholder = function(stringToFormat) {
        
        //Return the string surrounded in curly brackets
        return '{' + stringToFormat + '}';
    };

    //Gets the hierarchy position of the supplied test step type 
    var getStepTypeHierarchy = function(stepType) {
        
        //Convert the supplied type to lowercase and return the appropriate integer order
        switch (stepType.toLowerCase()) {
            
            //Given > When > Then
            case 'given': return 1;
            case 'when': return 2;
            case 'then': return 3;
            default: return 0;
        }
    };

    //Checks to see if an argument name is for a table
    var isTableArgumentName = function(argumentName) {
        
        //If the string starts and ends with a pipe symbol, then it is a table argument
        return argumentName.startsWith('|') && argumentName.endsWith('|');
    };

    //Gets the test step text from a string
    var getStepTextFromString = function(stepString) {
        
        //If the argument opening bracket does not exist in the string, just return the string
        //Otherwise, return a substring up to the start of the argument
        return stepString.indexOf('{') < 0
            ? stepString
            : stepString.substring(0, stepString.indexOf('{'));
    };

    //Gets the test step argument name from a string
    var getArgumentNameFromString = function(stepString) {
        
        //If the argument opening bracket does not exist in the string, just return an empty string
        //Otherwise, return a substring after the start of the bracket
        return argumentName = stepString.indexOf('{') < 0
            ? ''
            : stepString.substring(stepString.indexOf('{') + 1, stepString.length);
    };

    //Gets the test step argument value from a string
    var getArgumentValueFromString = function(stepString, stepIndex, usePlaceholderAsDefault) {
        
        //Get the argument name from the string
        var argumentName = getArgumentNameFromString(stepString);

        //If the argument name couldn't be found
        if (!argumentName) {
            
            //Return an empty string
            return '';
        }

        //Get the test step
        var step = $scope.systemTest.stepArguments[stepIndex];

        //If any arguments have already been recorded
        if (step.arguments) {

            //For each argument
            for (var i = 0; i < step.arguments.length; i++) {

                //If the argument name matches and a value has been recorded
                if (step.arguments[i].name == argumentName && step.arguments[i].value) {

                    //Return the value of the argument
                    return step.arguments[i].value;
                }
            }
        }

        //If this point is reached and a placeholder should be used
        if (usePlaceholderAsDefault) {

            //Return the formatted argument name
            return formatPlaceholder(argumentName);
        }
        else {

            //Otherwise, return an empty string
            return '';
        }
    };

    //Splits a string into columns
    var getColumns = function(argumentName) {
        
        //Split the argument name by the pipe symbol and remove any empty values
        return argumentName.split('|').filter(Boolean);
    };
    
    //Splits a string into rows and columns
    var getRows = function(argumentValue) {
        
        //Split the argument value by the split pipe symbol and remove any empty values
        var rows = argumentValue.split('¦').filter(Boolean);

        //Create an array to store the rows
        var rowsSplit = [];

        //For each row
        for (var i = 0; i < rows.length; i++) {

            //Split the row into columns and add this to the array
            rowsSplit.push(getColumns(rows[i]));
        }

        //Return the rows split
        return rowsSplit;
    };

    //Updates the returned data in the scope
    var updateScope = function(data) {
        
        $scope.acceptanceTests = data.acceptanceTests;
        $scope.features = data.features;
        $scope.project = data.project;
        $scope.systemTest = data.systemTest;
        updateStepsInScope(data.steps);
        $scope.userStories = data.userStories;
        $scope.stats = data.stats;
    };

    //Updates the test steps in the scope, both in original form and also by separating out the arguments
    var updateStepsInScope = function(steps) {

        //For each test step
        for (var t in steps) {

            //Create a new section in the test step to store the split version
            steps[t].split = [];
            
            //Get the hierarchical order of the test step type
            steps[t].typeHierarchy = getStepTypeHierarchy(steps[t].type);
            
            //Split the step by closing argument brackets
            var splitSections = steps[t].step.split('}');

            //For each split section
            for (var s in splitSections) {

                //Get the test step text
                var text = getStepTextFromString(splitSections[s]);

                //Get the argument name
                var argumentName = getArgumentNameFromString(splitSections[s]);

                //Check to see if this is a table argument
                var isTable = isTableArgumentName(argumentName);

                //Get the argument value
                var argumentValue = getArgumentValueFromString(splitSections[s], t, !isTable);

                //If the test step text is not empty
                if (text) {

                    //Add it to the split test step array
                    steps[t].split.push({
                        type: 'step-text',
                        value: text
                    });
                }

                //If the argument name is not empty and this is a table argument
                if (argumentName && isTable) {

                    //Get the argument name split into column values
                    var argumentNameColumns = getColumns(argumentName);
                    
                    //Add it to the split test step array
                    steps[t].split.push({
                        field: argumentName,
                        isHidden: true,
                        isTableHeader: true,
                        type: 'step-argument-name-table-header',
                        value: argumentNameColumns
                    });
                }

                //If the argument value is not empty and this is not a table argument
                if (argumentValue && !isTable) {
                    
                    //Determine how the argument value will be displayed
                    var type = argumentValue.startsWith('{') && argumentValue.endsWith('}')
                        ? 'step-argument-value-not-supplied'
                        : 'step-argument-value-supplied';

                    //Add it to the split test step array
                    steps[t].split.push({
                        field: argumentName,
                        isEditable: !isTable,
                        isHidden: isTable,
                        type: type,
                        value: argumentValue
                    });
                }
                //Else if this is a table argument
                else if (isTable) {

                    //Get the argument value split into row and column values
                    var argumentValueRows = getRows(argumentValue);

                    //Add it to the split test step array
                    steps[t].split.push({
                        field: argumentName,
                        isHidden: true,
                        isTableRows: true,
                        type: 'step-argument-value-table-rows',
                        value: argumentValue,
                        valueSplit: argumentValueRows
                    });
                }
            }
        }
        
        //Add the test steps to the scope
        $scope.steps = steps;
    };

    //Sends the system test data in the scope to the server
    var updateSystemTest = function() {
        
        //Update the system test with the data in the scope
        dbSystemTest.updateSystemTest($scope.systemTest).$promise.then(function() {

            //Clear any existing errors
            $scope.error = null;

        }, function(error) {

            //Add the error message to the scope
            $scope.error = error.data.message;
        });
    };

    //Get the systemTest data
    dbSystemTest.getSystemTest(projectCode, systemTestCode).$promise.then(function(data) {

        //Store the data in the scope
        updateScope(data);

        //Store the old value of a field as it is being edited
        $scope.oldData = {};

        //Shows or hides the form used to edit the field
        $scope.showEdit = function(show, fieldID, stepNumber, sectionNumber) {

            //If the form should be shown
            if (show) {

                //If the test step and section numbers were supplied
                if (typeof stepNumber !== 'undefined' && typeof sectionNumber !== 'undefined') {
                    
                    //Store the old data from the test steps section
                    $scope.oldData[fieldID] = $scope.steps[stepNumber].split[sectionNumber].value;
                }
                else {
                    
                    //Store the old data from the system test section
                    $scope.oldData[fieldID] = $scope.systemTest[fieldID];
                }

                //If the edit object is null
                if (!$scope.edit) {

                    //Create an empty object
                    //This disabled ng-sortable until the user stops editing
                    $scope.edit = {};
                }

                //Show the edit fields
                $scope.edit[fieldID] = show;
            }
            //Else if the field is no longer being edited
            else if ($scope.edit[fieldID]) {

                //Delete the key from the edit object
                delete $scope.edit[fieldID];

                //If the edit object contains no keys
                if (!Object.keys($scope.edit).length) {

                    //Nullify it
                    //This re-enables ng-sortable as the user has stopped editing
                    $scope.edit = null;
                }
            }
        };

        //Cancels editing the field and hides the form
        $scope.cancelEdit = function(fieldID, stepNumber, sectionNumber) {

            //If the test step and section numbers were supplied
            if (typeof stepNumber !== 'undefined' && typeof sectionNumber !== 'undefined') {
                
                //Reset the old data from the test steps section
                $scope.steps[stepNumber].split[sectionNumber].value = $scope.oldData[fieldID];
            }
            else {
                
                //Reset the old data from the system test section
                $scope.systemTest[fieldID] = $scope.oldData[fieldID];
            }

            //Stop editing
            $scope.showEdit(false, fieldID, stepNumber, sectionNumber);
        };

        //Submits the edits made to the system test to the server
        $scope.submitEdit = function(fieldID) {

            //Save the system test
            updateSystemTest();
            
            //Stop editing
            $scope.showEdit(false, fieldID);
        };

        //Submits the edits made to the test steps to the server
        $scope.submitEditForStep = function(fieldID, stepNumber, sectionNumber, argumentName, argumentValue) {
                
            //If the argument value was cleared
            if (!argumentValue) {
                
                //Set the type to show that no value was supplied
                $scope.steps[stepNumber].split[sectionNumber].type = 'step-argument-value-not-supplied';
                
                //Reset the value back to the argument name, which is recorded in the previous section
                $scope.steps[stepNumber].split[sectionNumber].value
                = formatPlaceholder($scope.steps[stepNumber].split[sectionNumber - 1].value);                
            }
            else {
                
                //Set the type to show that a value was supplied
                $scope.steps[stepNumber].split[sectionNumber].type = 'step-argument-value-supplied';
            }
            
            //Get the arguments for the test step
            var arguments = $scope.systemTest.stepArguments[stepNumber].arguments;

            //If the arguments list is non-existent
            if (!arguments) {
                
                //Create it with the argument name and value
                arguments = [{name: argumentName, value: argumentValue}];
            }
            else {
                
                //Record if a matching argument is found
                var isMatch = false;
                
                //For each existing argument
                for (var i = 0; i < arguments.length; i++) {
                    
                    //If the argument name matches
                    if (arguments[i].name == argumentName) {
                        
                        //Update the value
                        arguments[i].value = argumentValue;
                        
                        //Record that the argument was found and updated
                        isMatch = true;
                        
                        //Break from the loop
                        break;
                    }
                }
                
                //If the argument was not found
                if (!isMatch) {
                    
                    //Add it to the arguments list
                    arguments.push({name: argumentName, value: argumentValue});
                }
            }

            //Update the arguments in the scope
            $scope.systemTest.stepArguments[stepNumber].arguments = arguments;

            //Save the system test
            updateSystemTest();
            
            //Stop editing
            $scope.showEdit(false, fieldID, stepNumber, sectionNumber);
        };

        //Submits the edits made to a test step table argument to the server
        $scope.submitEditForStepTable = function(fieldID, stepNumber, sectionNumber, argumentName, argumentValue) {

            //Submit the test step edits
            $scope.submitEditForStep(fieldID, stepNumber, sectionNumber, argumentName, argumentValue);

            //Update the test step data in the scope to regenerate the tables
            updateStepsInScope($scope.steps);
        };

        //Set the test step reorder listeners
        $scope.stepReorderListeners = {
            
            //When the order changes
            orderChanged: function(event) {
                
                //Get the source and destination index of the test step that was reordered
                var sourceIndex = event.source.index;
                var destinationIndex = event.dest.index;
                
                //Remove the element from the list
                var removedElement = $scope.systemTest.stepArguments.splice(sourceIndex, 1)[0];
                
                //Add the element back into the list at the new position
                $scope.systemTest.stepArguments.splice(destinationIndex, 0, removedElement);
                
                //Save the system test
                dbSystemTest.updateSystemTest($scope.systemTest);
            }
        };

        //Store test step search results
        $scope.stepResults = [];

        //Searches for matching steps
        $scope.searchForStep = function() {

            //Search for a match
            dbStep.searchForStep(projectCode, $scope.newStep.type, $scope.newStep.step).$promise.then(function(results) {

                //Add the search results to the scope
                $scope.stepResults = results;

                //Set the current time
                $scope.stepResultsTime = new Date();
                
                //If no results were found
                if (!results.length) {
                    
                    //Set the default value in the results dropdown to create the step
                    $scope.newStep.code = -1;
                }
            });
        };

        //Store data on new test steps which are added
        $scope.newStep = {};

        //Clears the test step search window and sets the new test step position to the end of the list
        $scope.clearStepResults = function() {
            
            //Clear the last selected test step
            $scope.newStep.code = null;
            
            //Clear the search results
            $scope.stepResults = [];

            //Clear the search time
            $scope.stepResultsTime = null;
        }

        //Clears the test step search window and sets the new test step position to the end of the list
        $scope.clearStepSearch = function(isEdit, position) {

            //Set the default position to the end of the list if none was supplied
            position = typeof position === 'undefined' ? $scope.steps.length : position;

            //If a test step is being edited or a test step search result was selected previously
            if (isEdit || $scope.newStep.code) {

                //Clear the results
                $scope.clearStepResults();

                //Clear all the form fields
                $scope.newStep = {};
            }

            //Record if this is an edit to an existing step or a new one
            $scope.newStep.isEdit = isEdit;
            
            //Set the position of the test step in the list
            $scope.newStep.position = position;
        };

        //Adds a test step to the system test
        $scope.addStep = function() {

            //Get the test step data from the scope
            var step = {
                code: $scope.newStep.code,
                isEdit: $scope.newStep.isEdit,
                position: $scope.newStep.position,
                projectCode: projectCode,
                systemTestCode: systemTestCode
            };

            //Add the test step
            dbStep.addStep(step).$promise.then(function(data) {

                //Clear any existing errors
                $scope.stepError = null;

                //Store the updated data in the scope
                $scope.systemTest = data.systemTest;
                updateStepsInScope(data.steps);
                
                //Close the dialog (JQuery)
                $("#ModalAddStepCloseButton").trigger('click');

            }, function(error) {

                //Add the error message to the scope
                $scope.stepError = error.data.message;
            });
        };

        //Creates a test step and adds it to the system test
        $scope.createStep = function() {

            //Get the test step data from the scope
            var step = {
                code: null,
                type: $scope.newStep.type,
                step: $scope.newStep.step,
                projectCode: projectCode
            };

            //Create the test step
            dbStep.createStep(step).then(function(data) {

                //Clear any existing errors
                $scope.stepError = null;
                
                //Store the new test step code in the scope
                $scope.newStep.code = data.code;

                //Add the step to the system test
                $scope.addStep();

            }, function(error) {

                //Add the error message to the scope
                $scope.stepError = error.data.message;
            });
        };

        //Imports the steps using the supplied JSON
        $scope.importStep = function() {

            //Parse the imported data from a string into JSON to allow it to be modified
            var dataToImport = JSON.parse($scope.imported);
            
            //Add the project code
            dataToImport.projectCode = projectCode;

            //Import the project
            dbStep.importStep(dataToImport).$promise.then(function(data) {

                //Hide the dialog (JQuery)
                $('#ModalImportStepCloseButton').trigger('click');

            }, function(error) {
                
                //Add the error message to the scope
                $scope.importStepError = error.data.message;
            });
        };

        //Store acceptance test search results
        $scope.acceptanceTestResults = [];

        //Searches for matching acceptance tests
        $scope.searchForAcceptanceTest = function() {

            //Search for a match
            dbAcceptanceTest.searchForAcceptanceTest(projectCode, $scope.newAcceptanceTest.criteria).$promise.then(function(results) {

                //Clear any old error messages
                $scope.acceptanceTestError = null;
                
                //Add the search results to the scope
                $scope.acceptanceTestResults = results;

                //Set the current time
                $scope.acceptanceTestResultsTime = new Date();

            }, function(error) {

                //Add the error message to the scope
                $scope.acceptanceTestError = error.data.message;
            });
        };

        //Store data on new acceptance tests which are added
        $scope.newAcceptanceTest = {};

        //Clears the acceptance test search window
        $scope.clearAcceptanceTestResults = function() {
            
            //Clear the last selected acceptance test
            $scope.newAcceptanceTest.index = null;
            
            //Clear the search results
            $scope.acceptanceTestResults = [];

            //Clear the search time
            $scope.acceptanceTestResultsTime = null;
        };

        //Adds an acceptance test to the system test
        $scope.addAcceptanceTest = function(closeOnCompletion) {

            //Get the selected acceptance test index
            var index = $scope.newAcceptanceTest.index;

            //Get the acceptance test data from the scope
            var acceptanceTest = $scope.acceptanceTestResults[index];

            //If the list of system test acceptance test codes doesn't exist
            if (!$scope.systemTest.acceptanceTestCodes) {
                
                //Create it
                $scope.systemTest.acceptanceTestCodes = [];
            }

            //If the list of acceptance tests doesn't exist
            if (!$scope.acceptanceTests) {
                
                //Create it
                $scope.acceptanceTests = [];
            }

            //If the code doesn't exist in the acceptance test codes list
            if ($scope.systemTest.acceptanceTestCodes.indexOf(acceptanceTest.code) < 0) {

                //Add the acceptance test code to the system test list
                $scope.systemTest.acceptanceTestCodes.push({
                    code: acceptanceTest.code,
                    featureCode: acceptanceTest.featureCode
                });

                //Add the acceptance test to the acceptance test list
                $scope.acceptanceTests.push(acceptanceTest);

                //Save the system test
                dbSystemTest.updateSystemTest($scope.systemTest).$promise.then(function(data) {
                    
                    //Clear any existing errors
                    $scope.acceptanceTestError = null;
                    
                    //If the dialog should be closed on completion
                    if (closeOnCompletion) {
                        
                        //Close the dialog (JQuery)
                        $("#ModalAddAcceptanceTestCloseButton").trigger('click');
                    }
                }, function(error) {

                    //Add the error message to the scope
                    $scope.acceptanceTestError = error.data.message;
                });
            }
        };

        //Removes an acceptance test from the system test
        $scope.removeAcceptanceTest = function(code) {

            //For each acceptance test code
            for (var i = 0; i < $scope.systemTest.acceptanceTestCodes.length; i++) {
                
                //If the acceptance test code matches the supplied code
                if ($scope.systemTest.acceptanceTestCodes[i].code == code) {

                    //Remove it from the array of acceptance tests
                    $scope.systemTest.acceptanceTestCodes.splice(i, 1);

                    //Break from the loop
                    break;
                }
            }
            
            //For each acceptance test
            for (var i = 0; i < $scope.acceptanceTests.length; i++) {
                
                //If the acceptance test code matches the supplied code
                if ($scope.acceptanceTests[i].code == code) {

                    //Remove it from the array of acceptance tests
                    $scope.acceptanceTests.splice(i, 1);

                    //Break from the loop
                    break;
                }
            }

            //Save the system test
            dbSystemTest.updateSystemTest($scope.systemTest).$promise.then(function(data) {
                
                //Clear any existing errors
                $scope.acceptanceTestError = null;

            }, function(error) {

                //Add the error message to the scope
                $scope.acceptanceTestError = error.data.message;
            });
        };
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
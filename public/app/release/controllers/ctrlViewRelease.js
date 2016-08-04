angular.module('app').controller('ctrlViewRelease', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease, dbFeature) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var releaseCode = $routeParams.releaseCode;

    //Set the page title
    $rootScope.title += projectCode + '.' + releaseCode;

    //Set the navigation settings
    $scope.nav = {
        feature: {edit: true},
        release: {isCurrentSection: true},
        settings: {isExpanded: true}
    };

	//Get the release data
	dbRelease.getRelease(projectCode, releaseCode).$promise.then(function(data) {
        
        //Store the data in the scope
        $scope.project = data.project;
        $scope.release = data.release;
        $scope.features = data.features;
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
                $scope.oldData[field] = $scope.release[field];
            }

            //Show the edit fields
            $scope.edit[field] = show;
        };

        //Cancels editing the field and hides the form
        $scope.cancelEdit = function(field) {

            //Reset the value
            $scope.release[field] = $scope.oldData[field];

            //Stop editing
            $scope.showEdit(field, false);
        };

        //Submits the edits made to the field to the server
        $scope.submitEdit = function(field) {
            
            //Save the release
            dbRelease.updateRelease($scope.release);

            //Stop editing
            $scope.showEdit(field, false);
        };

        //Store feature search results
        $scope.featureResults = [];

        //Searches for matching features
        $scope.searchForFeature = function() {

            //Search for a match
            dbFeature.searchForFeature(projectCode, $scope.newFeature.name).$promise.then(function(results) {

                //Add the search results to the scope
                $scope.featureResults = results;

                //Set the current time
                $scope.featureResultsTime = new Date();
            });
        };

        //Store data on new features which are added
        $scope.newFeature = {};

        //Clears the feature search window
        $scope.clearFeatureResults = function() {
            
            //Clear the last selected feature
            $scope.newFeature.index = null;
            
            //Clear the search results
            $scope.featureResults = [];

            //Clear the search time
            $scope.featureResultsTime = null;
        };

        //Adds a feature to the release
        $scope.addFeature = function(closeOnCompletion) {

            //Get the selected feature index
            var index = $scope.newFeature.index;

            //Get the feature data from the scope
            var feature = {
                code: $scope.featureResults[index].code,
                name: $scope.featureResults[index].name
            };

            //If the list of release feature codes doesn't exist
            if (!$scope.release.featureCodes) {
                
                //Create it
                $scope.release.featureCodes = [];
            }

            //If the list of features doesn't exist
            if (!$scope.features) {
                
                //Create it
                $scope.features = [];
            }

            //If the code doesn't exist in the feature codes list
            if ($scope.release.featureCodes.indexOf(feature.code) < 0) {

                //Add the feature code to the release list
                $scope.release.featureCodes.push(feature.code);

                //Add the feature name to the feature list
                $scope.features.push({code: feature.code, name: feature.name});

                //Save the release
                dbRelease.updateRelease($scope.release).$promise.then(function(data) {
                    
                    //Clear any existing errors
                    $scope.featureError = null;
                    
                    //If the dialog should be closed on completion
                    if (closeOnCompletion) {
                        
                        //Close the dialog (JQuery)
                        $("#ModalAddFeatureCloseButton").trigger('click');
                    }
                }, function(error) {

                    //Add the error message to the scope
                    $scope.featureError = error.data.message;
                });
            }
        };

        //Removes a feature from the release
        $scope.removeFeature = function(code) {

            //Check if the feature code is in the release list
            var featureCodeIndex = $scope.release.featureCodes.indexOf(code);

            //If it is in the list
            if (featureCodeIndex > -1) {

                //Remove the feature code from the release list
                $scope.release.featureCodes.splice(featureCodeIndex, 1);
            }
            
            //For each feature
            for (var i = 0; i < $scope.features.length; i++) {
                
                //If the feature code matches the supplied code
                if ($scope.features[i].code == code) {

                    //Remove it from the array of features
                    $scope.features.splice(i, 1);

                    //Break from the loop
                    break;
                }
            }

            //Save the release
            dbRelease.updateRelease($scope.release).$promise.then(function(data) {
                
                //Clear any existing errors
                $scope.featureError = null;

            }, function(error) {

                //Add the error message to the scope
                $scope.featureError = error.data.message;
            });
        };
    }, function(error) {

        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
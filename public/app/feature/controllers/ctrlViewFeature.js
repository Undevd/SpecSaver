angular.module('app').controller('ctrlViewFeature', function($scope, $rootScope, $location, $routeParams, dbFeature) {
    
	//Get the route parameters
	var projectCode = $routeParams.projectCode;
	var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode;

    //Set the navigation settings
    $scope.nav = {
        feature: {isCurrentSection: true}
    };

    //Get the feature data
    dbFeature.getFeature(projectCode, featureCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.feature = data.feature;
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
                $scope.oldData[field] = $scope.feature[field];
            }

            //Show the edit fields
            $scope.edit[field] = show;
        };

        //Cancels editing the field and hides the form
        $scope.cancelEdit = function(field) {

            //Reset the value
            $scope.feature[field] = $scope.oldData[field];

            //Stop editing
            $scope.showEdit(field, false);
        };

        //Submits the edits made to the field to the server
        $scope.submitEdit = function(field) {

            //Save the feature
            dbFeature.updateFeature($scope.feature);

            //Stop editing
            $scope.showEdit(field, false);
        };  
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
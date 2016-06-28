angular.module('app').controller('ctrlCreateUserStory', function($scope, $rootScope, $location, $routeParams, dbFeature, dbUserStory) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode;

    //Set the navigation settings
    $scope.nav = {
        userStory: {isCurrentSection: true},
    };

    //Get the feature data
    dbFeature.getFeature(projectCode, featureCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.feature = data.feature;

        //Submits the new user story to the server
        $scope.submit = function() {

            //Create the new user story object with data from the form
            var newUserStory = {
                code: null,
                asA: $scope.asA,
                iCan: $scope.iCan,
                soThat: $scope.soThat,
                projectCode: projectCode,
                featureCode: featureCode
            };    

            //Create the user story in the database
            dbUserStory.createUserStory(newUserStory).then(function(userStory) {

                //Redirect to view the new user story
                $location.path('/p/' + userStory.projectCode + '/f/' + userStory.featureCode + '/u/' + userStory.code);

            }, function(error) {

                //Add the error message to the scope
                $scope.error = error.data.message;
            });
        };
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
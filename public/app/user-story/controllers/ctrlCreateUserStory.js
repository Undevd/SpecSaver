angular.module('app').controller('ctrlCreateUserStory', function($scope, $rootScope, $location, $routeParams, dbFeature, dbProject, dbUserStory) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + (featureCode ? ('-' + featureCode) : '');

    //Get the project data
    $scope.project = dbProject.getProject(projectCode);

    if (featureCode)
    {
        //Get the feature data
        $scope.feature = dbFeature.getFeature(projectCode, featureCode);
    }

    $scope.submit = function() {
        //Create the new user story object
        var newUserStory = {
            code: null,
            asA: $scope.asA,
            iCan: $scope.iCan,
            soThat: $scope.soThat,
            projectCode: projectCode,
            featureCode: $scope.feature.code
        };

        //Clear any previous errors
        $scope.error = null;        

        //Create the user story in the database
        dbUserStory.createUserStory(newUserStory).then(function(userStory) {
          //Redirect to view the new user story
          $location.path('/p/' + userStory.projectCode + '/f/' + userStory.featureCode + '/u/' + userStory.code);
        }, function(error) {
            //Add the error message to the scope
            $scope.error = error.data.reason;
        });
    }
});
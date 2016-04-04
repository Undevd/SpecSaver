angular.module('app').controller('ctrlCreateAcceptanceTest', function($scope, $rootScope, $location, $routeParams, dbAcceptanceTest, dbFeature, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode + '-' + userStoryCode;

    //Get the project data
    $scope.project = dbProject.getProject(projectCode);

    //Get the feature data
    $scope.feature = dbFeature.getFeature(projectCode, featureCode);

    $scope.submit = function() {
        //Create the new acceptance test object
        var newAcceptanceTest = {
            code: null,
            given: $scope.given,
            when: $scope.when,
            then: $scope.then,
            projectCode: projectCode,
            featureCode: $scope.feature.code
        };

        //Clear any previous errors
        $scope.error = null;        

        //Create the acceptance test in the database
        dbAcceptanceTest.createAcceptanceTest(newAcceptanceTest).then(function(acceptanceTest) {

          //Redirect to view the new acceptance test
          $location.path('/p/' + newAcceptanceTest.projectCode + '/f/' + newAcceptanceTest.featureCode + '/a/' + newAcceptanceTest.code);

        }, function(error) {

            //Add the error message to the scope
            $scope.error = error.data.reason;
        });
    }
});
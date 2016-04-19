angular.module('app').controller('ctrlCreateAcceptanceTest', function($scope, $rootScope, $location, $routeParams, dbAcceptanceTest, dbFeature) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode;

    //Get the feature data
    dbFeature.getFeature(projectCode, featureCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.feature = data.feature;

        //Submits the new acceptance test to the server
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

            //Create the acceptance test in the database
            dbAcceptanceTest.createAcceptanceTest(newAcceptanceTest).then(function(acceptanceTest) {

              //Redirect to view the new acceptance test
              $location.path('/p/' + acceptanceTest.projectCode + '/f/' + acceptanceTest.featureCode + '/a/' + acceptanceTest.code);

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
angular.module('app').controller('ctrlViewFeatureAcceptanceTests', function($scope, $rootScope, $routeParams, dbAcceptanceTest) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode;

    //Get the acceptance tests data
    dbAcceptanceTest.getAllAcceptanceTests(projectCode, featureCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.feature = data.feature;
        $scope.acceptanceTests = data.acceptanceTests;
        
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
angular.module('app').controller('ctrlViewFeatureAcceptanceTests', function($scope, $rootScope, $location, $routeParams, dbAcceptanceTest) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode;

    //Set the navigation settings
    $scope.nav = {
        acceptanceTest: {isCurrentSection: true},
    };

    //Get the acceptance tests data
    dbAcceptanceTest.getAllAcceptanceTests(projectCode, featureCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.feature = data.feature;
        $scope.acceptanceTests = data.acceptanceTests;
        $scope.stats = data.stats;
        
        //Set the clickable row URL function
        $scope.goTo = function(acceptanceTestCode) {
            $location.path('/p/' + $scope.project.code + '/f/' + $scope.feature.code + '/a/' + acceptanceTestCode);
        };
        
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
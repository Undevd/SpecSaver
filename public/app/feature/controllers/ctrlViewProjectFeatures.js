angular.module('app').controller('ctrlViewProjectFeatures', function($scope, $rootScope, $routeParams, $location, dbFeature, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Set the navigation settings
    $scope.nav = {
        feature: {isCurrentSection: true},
    };

    //Get the features associated with the project
    dbFeature.getAllFeatures(projectCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.features = data.features;

        //Set the clickable row URL function
        $scope.goTo = function(featureCode) {
            $location.path('/p/' + $scope.project.code + '/f/' + featureCode);
        };

    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
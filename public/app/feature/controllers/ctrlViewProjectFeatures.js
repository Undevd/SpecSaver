angular.module('app').controller('ctrlViewProjectFeatures', function($scope, $rootScope, $routeParams, $location, dbFeature, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Get the features associated with the project
    dbFeature.getAllFeatures(projectCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.features = data.features;

    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
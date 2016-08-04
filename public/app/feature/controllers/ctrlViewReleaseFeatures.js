angular.module('app').controller('ctrlViewReleaseFeatures', function($scope, $rootScope, $location, $routeParams, dbFeature) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var releaseCode = $routeParams.releaseCode;

	//Set the page title
    $rootScope.title += projectCode + '.' + releaseCode;

    //Set the navigation settings
    $scope.nav = {
        feature: {isCurrentSection: true},
    };

    //Get the features associated with the release
    dbFeature.getAllFeatures(projectCode, releaseCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.release = data.release;
        $scope.features = data.features;
        $scope.stats = data.stats;

    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
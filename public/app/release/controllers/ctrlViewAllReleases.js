angular.module('app').controller('ctrlViewAllReleases', function($scope, $rootScope, $location, $routeParams, dbRelease) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    
	//Set the page title
    $rootScope.title += projectCode;

    //Set the navigation settings
    $scope.nav = {
        release: {isCurrentSection: true},
    };

    //Get the releases associated with the project
    dbRelease.getAllReleases(projectCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;
        $scope.releases = data.releases;
        $scope.stats = data.stats;

        //Set the clickable row URL function
        $scope.goTo = function(releaseCode) {
            $location.path('/p/' + $scope.project.code + '/r/' + releaseCode);
        };

    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
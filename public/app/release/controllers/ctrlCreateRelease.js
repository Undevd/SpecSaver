angular.module('app').controller('ctrlCreateRelease', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Set the navigation settings
    $scope.nav = {
        release: {isCurrentSection: true},
    };

    //Get the project data
    dbProject.getProject(projectCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;

        //Submits the new feature to the server
        $scope.submit = function() {

            //Create the new release object
            var newRelease = {
                name: $scope.name,
                code: $scope.code,
                description: $scope.description,
                projectCode: projectCode
            };

            //Create the release in the database
            dbRelease.createRelease(newRelease).then(function(release) {

                //Redirect to view the new release
                $location.path('/p/' + release.projectCode + '/r/' + release.code);

            }, function(error) {

                //Add the error message to the scope
                $scope.error = error.data.message;
            });
        };
    });
});
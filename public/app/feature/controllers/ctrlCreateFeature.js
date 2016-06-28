angular.module('app').controller('ctrlCreateFeature', function($scope, $rootScope, $routeParams, $location, dbFeature, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Set the navigation settings
    $scope.nav = {
        feature: {isCurrentSection: true},
    };

    //Get the project data
    dbProject.getProject(projectCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;

        //Submits the new feature to the server
        $scope.submit = function() {

            //Create the new feature object with data from the form
            var newFeature = {
                name: $scope.name,
                code: $scope.code,
                description: $scope.description,
                projectCode: projectCode
            };

            //Send the feature to the server
            dbFeature.createFeature(newFeature).then(function(feature) {

                //Redirect to view the new feature
                $location.path('/p/' + feature.projectCode + '/f/' + feature.code);

            }, function(error) {

                //Add the error message to the scope
                $scope.error = error.data.message;
            });
        }
    });
});
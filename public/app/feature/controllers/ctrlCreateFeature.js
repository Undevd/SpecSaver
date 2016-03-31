angular.module('app').controller('ctrlCreateFeature', function($scope, $rootScope, $routeParams, $location, dbFeature, dbProject, dbRelease) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Get the project data
    $scope.project = dbProject.getProject(projectCode);

    $scope.create = function() {
        //Create the new feature object
        var newFeature = {
            name: $scope.name,
            code: $scope.code,
            description: $scope.description,
            projectCode: projectCode
        };

        //Clear any previous errors
        $scope.error = null;

        //Create the feature in the database
        dbFeature.createFeature(newFeature).then(function(feature) {
            //Redirect to view the new feature
            $location.path('/p/' + feature.projectCode + '/f/' + feature.code);
        }, function(error) {
            //Add the error message to the scope
            $scope.error = error.data.reason;
        });
    }
});
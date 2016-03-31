angular.module('app').controller('ctrlCreateRelease', function($scope, $rootScope, $location, $routeParams, dbProject, dbRelease) {
    
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    $scope.project = dbProject.getProject(projectCode);

	$scope.submit = function() {
        //Create the new release object
        var newRelease = {
            name: $scope.name,
            code: $scope.code,
            description: $scope.description,
            projectCode: projectCode
        };

        //Clear any previous errors
        $scope.error = null;        

        //Create the release in the database
        dbRelease.createRelease(newRelease).then(function(release) {
          //Redirect to view the new release
          $location.path('/p/' + projectCode + '/r/' + release.code);
        }, function(error) {
            //Add the error message to the scope
            $scope.error = error.data.reason;
        });
    }
});
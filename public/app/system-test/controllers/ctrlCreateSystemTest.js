angular.module('app').controller('ctrlCreateSystemTest', function($scope, $rootScope, $routeParams, $location, dbProject, dbSystemTest) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Get the project data
    dbProject.getProject(projectCode).$promise.then(function(data) {

        //Store the data in the scope
        $scope.project = data.project;

        //Submits the new system test to the server
        $scope.submit = function() {

            //Create the new system test object with data from the form
            var newSystemTest = {
                name: $scope.name,
                code: null,
                description: $scope.description,
                projectCode: projectCode
            };

            //Send the system test to the server
            dbSystemTest.createSystemTest(newSystemTest).then(function(systemTest) {

                //Redirect to view the new systemTest
                $location.path('/p/' + systemTest.projectCode + '/f/' + systemTest.code);

            }, function(error) {

                //Add the error message to the scope
                $scope.error = error.data.message;
            });
        }
    });
});
angular.module('app').controller('ctrlCreateProject', function($scope, $location, dbProject, identitySvc) {
    
    $scope.users = 
    
    $scope.submit = function() {
        //Create the new project object
        var admins = [identitySvc.currentUser.username];
        var members = [identitySvc.currentUser.username];
        var newProject = {
            name: $scope.name,
            code: $scope.code,
            description: $scope.description,
            admins: admins,
            members: members
        };

        //Clear any previous errors
        $scope.error = null;

        //Create the project in the database
        dbProject.createProject(newProject).then(function(project) {
            //Redirect to view the new project
            $location.path('/p/' + project.code);
        }, function(error) {
            //Add the error message to the scope
            $scope.error = error.data.reason;
        });
    }
});
angular.module('app').controller('ctrlCreateProject', function($scope, $location, dbProject, identitySvc, userSvc) {
    
    $scope.users = userSvc.query();
    
    var admins = [identitySvc.currentUser.username];
    var members = [identitySvc.currentUser.username];
    
    $scope.addMember = function(username) {
        members.push(username);
    },
    
    $scope.removeMember = function(username) {
        var index = members.indexOf(username);
        members.splice(index, 1);
    },
    
    $scope.isMember = function(username) {
        if(members.indexOf(username) > -1) {
            return true;
        } else {
            return false;
        }
    },
    
    $scope.submit = function() {
        //Create the new project object
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
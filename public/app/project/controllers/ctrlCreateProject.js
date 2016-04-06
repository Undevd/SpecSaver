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
    
    //Submits the new project to the server
    $scope.submit = function() {

        //Create the new project object with data from the form
        var newProject = {
            name: $scope.name,
            code: $scope.code,
            description: $scope.description,
            admins: admins,
            members: members
        };
        
        //Send the project to the server
        dbProject.createProject(newProject).then(function(project) {

            //Redirect to view the new project
            $location.path('/p/' + project.code);

        }, function(error) {

            //Add the error message to the scope
            $scope.error = error.data.message;
        });
    }
});
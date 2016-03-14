angular.module('app').controller('mvProjectCtrl', function($scope, $location, mvProject, dbOps) {
    
    $scope.projects = mvProject.query();
    
    $scope.submit = function() {
        var newProject = {
            project: $scope.project,
            description: $scope.description
        };
        
        dbOps.createProject(newProject).then(function() {
            $location.path('/');
        }, function(reason) {
            console.log("failed to add project");
        });
    }
});
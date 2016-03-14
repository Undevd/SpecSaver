angular.module('app').controller('mvProjectCtrl', function($scope, $location, mvProject, dbOps) {
    
    $scope.projects = mvProject.query();
    console.log($scope.projects);
    
    $scope.share = function() {
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
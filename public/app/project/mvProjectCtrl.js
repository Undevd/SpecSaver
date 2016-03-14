angular.module('app').controller('mvProjectCtrl', function($scope, $location, dbOps) {
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
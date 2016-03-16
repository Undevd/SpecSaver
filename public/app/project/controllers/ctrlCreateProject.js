angular.module('app').controller('ctrlCreateProject', function($scope, $location, dbProject) {
    
    $scope.submit = function() {
        var newProject = {
            name: $scope.name,
            description: $scope.description
        };
        
        dbProject.createProject(newProject).then(function() {
            $location.path('/project');
        }, function(reason) {
            console.log("failed to add project");
        });
    }
});
angular.module('app').controller('ctrlCreateProject', function($scope, $location, dbProject) {
    
    $scope.submit = function() {
        var newProject = {
            name: $scope.name,
            description: $scope.description
        };
        
        dbProject.createProject(newProject).then(function(project) {
            $location.path('/project/' + project._id);
        }, function(reason) {
            console.log("failed to add project");
        });
    }
});
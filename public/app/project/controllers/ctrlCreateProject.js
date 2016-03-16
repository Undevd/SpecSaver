angular.module('app').controller('ctrlCreateProject', function($scope, $location, dbProject) {
    
    $scope.submit = function() {
        var newProject = {
            name: $scope.name,
            description: $scope.description
        };
        
        // dbProject.create(newProject).then(function() {
        //     $location.path('/');
        // }, function(reason) {
        //     console.log("failed to add project");
        // });

        dbProject.createProject(newProject);

        $location.path('/project');
    }
});
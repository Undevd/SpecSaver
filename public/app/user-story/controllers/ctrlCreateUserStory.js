angular.module('app').controller('ctrlCreateUserStory', function($scope, $location, dbOps) {
    $scope.create = function() {
        var newUserStory = {
            name: $scope.name,
            story: $scope.story
        };
        
        dbOps.createUserStory(newUserStory).then(function() {
            $location.path('/user-story');
        }, function(reason) {
            console.log("failed to add user story");
        });
    }
});
angular.module('app').controller('mvUserStoryCtrl', function($scope, $location, dbOps) {
    $scope.create = function() {
        var newUserStory = {
            name: $scope.name,
            story: $scope.story
        };
        
        dbOps.createUserStory(newUserStory).then(function() {
            $location.path('/');
        }, function(reason) {
            console.log("failed to add user story");
        });
    }
});
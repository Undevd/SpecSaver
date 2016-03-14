angular.module('app').controller('mvTestCtrl', function($scope, $location, dbOps) {
	$scope.submit = function() {
        var newTest = {
            name: $scope.name,
            description: $scope.description
        };
        
        dbOps.createTest(newTest).then(function() {
            $location.path('/');
        }, function(reason) {
            console.log("failed to add test");
        });
    }
});
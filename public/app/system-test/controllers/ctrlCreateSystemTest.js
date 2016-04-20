angular.module('app').controller('ctrlCreateSystemTest', function($scope, $location, dbOps) {
	$scope.submit = function() {
        var newTest = {
            name: $scope.name,
            description: $scope.description
        };
        
        dbOps.createTest(newTest).then(function() {
            $location.path('/test');
        }, function(reason) {
            console.log("failed to add test");
        });
    }
});
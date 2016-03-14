angular.module('app').controller('mvTestStepCtrl', function($scope, $location, dbOps) {
	$scope.create = function() {
        var newTestStep = {
            description: $scope.description
        };
        
        dbOps.createTestStep(newTestStep).then(function() {
            $location.path('/');
        }, function(reason) {
            console.log("failed to add test step");
        });
    }
});
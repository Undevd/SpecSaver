angular.module('app').controller('mvQuoteCtrl', function($scope, $location, dbOps) {
    $scope.share = function() {
        var newQuote = {
            quote: $scope.quote,
            person: $scope.person
        };
        
        dbOps.createQuote(newQuote).then(function() {
            $location.path('/release/view-releases');
        }, function(reason) {
            console.log("failed to add quote");
        });
    }
});
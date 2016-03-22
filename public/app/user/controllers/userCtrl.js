angular.module('app').controller('userCtrl', function($scope, userSvc) {

    $scope.users = userSvc.query;
    
});
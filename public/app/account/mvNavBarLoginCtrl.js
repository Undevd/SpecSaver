angular.module('app').controller('mvNavBarLoginCtrl', function($scope, mvNotifier, mvIdentity, mvAuth) {
    
    $scope.identity = mvIdentity;
    
    $scope.login = function(username, password) {
        mvAuth.authenticateUser(username, password).then(function(success) {
            if(success) {
                mvNotifier.notify('You have successfully logged in');
            } else {
                mvNotifier.notify('Failed to sign in, check your username and password');
            }
        });
    }
});
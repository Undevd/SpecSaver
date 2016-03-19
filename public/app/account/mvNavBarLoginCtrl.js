angular.module('app').controller('mvNavBarLoginCtrl', function($scope, $location, mvNotifier, mvIdentity, mvAuth) {
    
    $scope.identity = mvIdentity;
    
    $scope.login = function(username, password) {
        mvAuth.authenticateUser(username, password).then(function(success) {
            if(success) {
                mvNotifier.notify('You have successfully logged into SpecSaver');
            } else {
                mvNotifier.notify('Failed to sign in, check your username and password');
            }
        });
    }
    
    $scope.logout = function() {
        mvAuth.logoutUser().then(function() {
            $scope.username = "";
            $scope.password = "";
            mvNotifier.notify('You have successfully logged out of SpecSaver');
            $location.path('/');
        });
    }
});
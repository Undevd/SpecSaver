angular.module('app').controller('ctrlNavBarLogin', function($scope, $location, mvNotifier, identitySvc, authSvc) {
    
    $scope.identity = identitySvc;
    
    $scope.login = function(username, password) {
        authSvc.authenticateUser(username, password).then(function(success) {
            if(success) {
                mvNotifier.notify('You have successfully logged into SpecSaver');
            } else {
                mvNotifier.notify('Failed to sign in, check your username and password');
            }
        });
    }
    
    $scope.logout = function() {
        authSvc.logoutUser().then(function() {
            $scope.username = "";
            $scope.password = "";
            mvNotifier.notify('You have successfully logged out of SpecSaver');
            $location.path('/');
        });
    }
});
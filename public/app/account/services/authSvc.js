angular.module('app').factory('authSvc', function($http, $q, identitySvc) {
    return {
        authenticateUser: function(username, password) {
            var dfd = $q.defer();
            $http.post('/login', {username:username, password:password}).then(function(response) {
                if(response.data.success) {
                    identitySvc.currentUser = response.data.user;
                    dfd.resolve(true);
                    
                } else {
                    dfd.resolve(false);
                }
            });
            return dfd.promise;
        },
        
        logoutUser: function() {
            var dfd = $q.defer();
            $http.post('/logout', {logout: true}).then(function() {
                identitySvc.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        }
    }
})
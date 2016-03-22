angular.module('app').factory('userSvc', function($resource) {
    return $resource('/api/users/:userId', {projectCode: "@userId"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/users/:userId'}
    });
});


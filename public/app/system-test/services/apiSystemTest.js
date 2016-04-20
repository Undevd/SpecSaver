angular.module('app').factory('apiSystemTest', function($resource) {
    return $resource('/api/system-test/:id', {_id: "@id"}, {
        query: {method: 'GET', isArray: true, cancellable: true},
        update: {method: 'PUT', isArray: false}
    });
});
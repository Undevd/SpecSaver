angular.module('app').factory('apiRelease', function($resource) {
    var ReleaseResource = $resource('/api/releases/:projectId', {projectId: "@projectId"}, {
        query: {method: 'GET', isArray: true, cancellable: true},
        queryOne: {method: 'GET', isArray: false, cancellable: true},
        update: {method: 'PUT', isArray: false}
    });
    
    return ReleaseResource;
});
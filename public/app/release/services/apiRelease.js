angular.module('app').factory('apiRelease', function($resource) {
    return $resource('/api/releases/:projectId/:releaseId', {projectId: "@projectId", releaseId: "@releaseId"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/releases/query/:projectId'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/querycount/:projectId'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/queryone/:projectId/:releaseId'},
        update: {method: 'PUT', isArray: false}
    });
});
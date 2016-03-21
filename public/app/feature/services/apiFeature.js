angular.module('app').factory('apiFeature', function($resource) {
    return $resource('/api/features/:projectId/:releaseId', {projectId: "@projectId", releaseId: "@releaseId"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/features/query/:projectId/:releaseId'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/querycount/:projectId'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/queryone/:projectId/:releaseId'},
        update: {method: 'PUT', isArray: false, url: '/api/releases/update'}
    });
});
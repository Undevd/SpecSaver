angular.module('app').factory('apiFeature', function($resource) {
    return $resource('/api/features/:projectCode/:releaseId', {projectCode: "@projectCode", releaseId: "@releaseId"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/features/query/:projectCode/:releaseId'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/querycount/:projectCode'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/queryone/:projectCode/:releaseId'},
        update: {method: 'PUT', isArray: false, url: '/api/releases/update'}
    });
});
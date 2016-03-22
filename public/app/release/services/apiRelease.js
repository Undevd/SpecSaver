angular.module('app').factory('apiRelease', function($resource) {
    return $resource('/api/releases/:projectCode/:releaseId', {projectCode: "@projectCode", releaseId: "@releaseId"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/releases/query/:projectCode'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/querycount/:projectCode'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/queryone/:projectCode/:releaseId'},
        update: {method: 'PUT', isArray: false, url: '/api/releases/update'}
    });
});
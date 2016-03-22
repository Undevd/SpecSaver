angular.module('app').factory('apiFeature', function($resource) {
    return $resource('/api/features/:projectCode/:releaseCode', {projectCode: "@projectCode", releaseCode: "@releaseCode"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/features/query/:projectCode/:releaseCode'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/querycount/:projectCode'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/queryone/:projectCode/:releaseCode'},
        update: {method: 'PUT', isArray: false, url: '/api/releases/update'}
    });
});
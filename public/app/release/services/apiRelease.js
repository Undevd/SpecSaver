angular.module('app').factory('apiRelease', function($resource) {
    return $resource('/api/releases/:projectCode/:releaseCode', {projectCode: "@projectCode", releaseCode: "@releaseCode"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/releases/query/:projectCode'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/querycount/:projectCode'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/queryone/:projectCode/:releaseCode'},
        update: {method: 'PUT', isArray: false, url: '/api/releases/update'}
    });
});
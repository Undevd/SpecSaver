angular.module('app').factory('apiFeature', function($resource) {
    return $resource('/api/features/:projectCode/:featureCode', {projectCode: "@projectCode", featureCode: "@featureCode"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/features/query/:projectCode/:featureCode'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/querycount/:projectCode'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/queryone/:projectCode/:featureCode'},
        update: {method: 'PUT', isArray: false, url: '/api/features/update'}
    });
});
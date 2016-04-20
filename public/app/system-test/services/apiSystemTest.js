angular.module('app').factory('apiSystemTest', function($resource) {
    return $resource('/api/system-tests/:projectCode/:systemTestCode', {projectCode: "@projectCode", systemTestCode: "@systemTestCode"}, {
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/system-tests/all/:projectCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/system-tests/one/:projectCode/:systemTestCode'},
        update: {method: 'PUT', isArray: false}
    });
});
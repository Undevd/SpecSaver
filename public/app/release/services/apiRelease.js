angular.module('app').factory('apiRelease', function($resource) {
    return $resource('/api/releases/:projectCode/:releaseCode', {projectCode: "@projectCode", releaseCode: "@releaseCode"}, {
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/all/:projectCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/one/:projectCode/:releaseCode'},
        update: {method: 'PUT', isArray: false}
    });
});
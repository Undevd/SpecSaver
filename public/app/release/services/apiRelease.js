angular.module('app').factory('apiRelease', function($resource) {
    return $resource('/api/releases/:projectCode/:releaseCode', {projectCode: "@projectCode", releaseCode: "@releaseCode"}, {
        countFor: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/count/for/:projectCode'},
        getAll: {method: 'GET', isArray: true, cancellable: true, url: '/api/releases/get/all/:projectCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/releases/get/one/:projectCode/:releaseCode'},
        update: {method: 'PUT', isArray: false}
    });
});
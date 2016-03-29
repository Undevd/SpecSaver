angular.module('app').factory('apiFeature', function($resource) {
    return $resource('/api/features/:projectCode/:featureCode', {projectCode: "@projectCode", releaseCode: "@releaseCode", featureCode: "@featureCode"}, {
        countFor: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/count/for/:projectCode/:releaseCode'},
        getAll: {method: 'GET', isArray: true, cancellable: true, url: '/api/features/get/all/:projectCode/:releaseCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/get/one/:projectCode/:featureCode'},
        update: {method: 'PUT', isArray: false}
    });
});
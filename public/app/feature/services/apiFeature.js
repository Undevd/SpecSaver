angular.module('app').factory('apiFeature', function($resource) {
    return $resource('/api/features/:projectCode/:featureCode', {projectCode: "@projectCode", releaseCode: "@releaseCode", featureCode: "@featureCode"}, {
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/all/:projectCode/:releaseCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/features/one/:projectCode/:featureCode'},
        search: {method: 'GET', isArray: true, cancellable: true, url: '/api/features/search/:projectCode/:name'},
        update: {method: 'PUT', isArray: false}
    });
});
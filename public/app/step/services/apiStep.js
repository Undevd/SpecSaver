angular.module('app').factory('apiStep', function($resource) {
    return $resource('/api/steps/:projectCode/:stepCode', {projectCode: "@projectCode", stepCode: "@stepCode"}, {
      	add: {method: 'PUT', isArray: false, cancellable: false, url: '/api/steps/add/:projectCode'},
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/steps/all/:projectCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/steps/one/:projectCode/:stepCode'},
        search: {method: 'GET', isArray: true, cancellable: true, url: '/api/steps/search/:projectCode/:type/:step'},
        update: {method: 'PUT', isArray: false}
    });
});
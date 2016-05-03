angular.module('app').factory('apiTestStep', function($resource) {
    return $resource('/api/test-steps/:projectCode/:testStepCode', {projectCode: "@projectCode", testStepCode: "@testStepCode"}, {
      	add: {method: 'PUT', isArray: false, cancellable: false, url: '/api/test-steps/add/:projectCode'},
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/test-steps/all/:projectCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/test-steps/one/:projectCode/:testStepCode'},
        search: {method: 'GET', isArray: true, cancellable: true, url: '/api/test-steps/search/:projectCode/:type/:step'},
        update: {method: 'PUT', isArray: false}
    });
});
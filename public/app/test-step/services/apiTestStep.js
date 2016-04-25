angular.module('app').factory('apiTestStep', function($resource) {
    return $resource('/api/test-steps/:projectCode/:testStepCode', {projectCode: "@projectCode", testStepCode: "@testStepCode"}, {
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/test-steps/all/:projectCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/test-steps/one/:projectCode/:testStepCode'},
        update: {method: 'PUT', isArray: false}
    });
});
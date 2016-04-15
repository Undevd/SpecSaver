angular.module('app').factory('apiAcceptanceTest', function($resource) {
    return $resource('/api/acceptance-tests/:projectCode/:featureCode/:userStoryCode/:acceptanceTestCode', {projectCode: "@projectCode", featureCode: "@featureCode", userStoryCode: "@userStoryCode", acceptanceTestCode: "@acceptanceTestCode"}, {
        countFor: {method: 'GET', isArray: false, cancellable: true, url: '/api/acceptance-tests/count/for/:projectCode/:featureCode/:userStoryCode'},
       	countGrouped: {method: 'GET', isArray: true, cancellable: true, url: '/api/acceptance-tests/count/grouped/:projectCode/:featureCode'},
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/acceptance-tests/get/all/:projectCode/:featureCode/:userStoryCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/acceptance-tests/get/one/:projectCode/:featureCode/:acceptanceTestCode'},
        update: {method: 'PUT', isArray: false}
    });
});
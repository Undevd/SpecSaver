angular.module('app').factory('apiUserStory', function($resource) {
    return $resource('/api/user-stories/:projectCode/:featureCode/:userStoryCode', {projectCode: "@projectCode", featureCode: "@featureCode", userStoryCode: "@userStoryCode"}, {
        countFor: {method: 'GET', isArray: false, cancellable: true, url: '/api/user-stories/count/for/:projectCode/:featureCode'},
       	countGrouped: {method: 'GET', isArray: true, cancellable: true, url: '/api/user-stories/count/grouped/:projectCode'},
        getAll: {method: 'GET', isArray: true, cancellable: true, url: '/api/user-stories/get/all/:projectCode/:featureCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/user-stories/get/one/:projectCode/:featureCode/:userStoryCode'},
        update: {method: 'PUT', isArray: false}
    });
});
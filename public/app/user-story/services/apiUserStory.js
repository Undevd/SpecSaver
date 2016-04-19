angular.module('app').factory('apiUserStory', function($resource) {
    return $resource('/api/user-stories/:projectCode/:featureCode/:userStoryCode', {projectCode: "@projectCode", featureCode: "@featureCode", userStoryCode: "@userStoryCode"}, {
        getAll: {method: 'GET', isArray: false, cancellable: true, url: '/api/user-stories/all/:projectCode/:featureCode'},
        getOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/user-stories/one/:projectCode/:featureCode/:userStoryCode'},
        update: {method: 'PUT', isArray: false}
    });
});
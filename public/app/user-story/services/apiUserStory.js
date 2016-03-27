angular.module('app').factory('apiUserStory', function($resource) {
    return $resource('/api/user-stories/:projectCode/:featureCode/:userStoryCode', {projectCode: "@projectCode", featureCode: "@featureCode", userStoryCode: "@userStoryCode"}, {
        query: {method: 'GET', isArray: true, cancellable: true, url: '/api/user-stories/query/:projectCode/:featureCode'},
        queryCount: {method: 'GET', isArray: false, cancellable: true, url: '/api/user-stories/querycount/:projectCode/:featureCode'},
        queryOne: {method: 'GET', isArray: false, cancellable: true, url: '/api/user-stories/queryone/:projectCode/:featureCode/:userStoryCode'},
        update: {method: 'PUT', isArray: false, url: '/api/user-stories/update'}
    });
});
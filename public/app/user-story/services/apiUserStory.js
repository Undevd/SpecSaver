angular.module('app').factory('apiUserStory', function($resource) {
    var UserStoryResource = $resource('/api/user-stories/:id', { _id: "@id" }, {
        query: {method:'GET', isArray:true, cancellable: true},
        update:{method:'PUT', isArray:false }
    });
    
    return UserStoryResource;
});
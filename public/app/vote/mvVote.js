angular.module('app').factory('mvVote', function($resource) {
    var VoteResource = $resource('/api/votes/:id', {_id: "@id"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return VoteResource;
});
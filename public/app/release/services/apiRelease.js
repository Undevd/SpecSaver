angular.module('app').factory('apiRelease', function($resource) {
    var ReleaseResource = $resource('/api/releases/:id', {_id: "@id"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return ReleaseResource;
});
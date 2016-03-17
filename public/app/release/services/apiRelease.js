angular.module('app').factory('apiRelease', function($resource) {
    var ReleaseResource = $resource('/api/releases/:projectId', {projectId: "@projectId"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return ReleaseResource;
});
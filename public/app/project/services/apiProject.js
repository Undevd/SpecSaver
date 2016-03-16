angular.module('app').factory('apiProject', function($resource) {
    var projectResource = $resource('/api/projects/:projectId', {projectId: "@projectId"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return projectResource;
});
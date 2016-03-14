
angular.module('app').factory('mvProject', function($resource) {
    var projectResource = $resource('/api/project/:id', {_id: "@id"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return projectResource;
});
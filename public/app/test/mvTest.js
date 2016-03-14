angular.module('app').factory('mvTest', function($resource) {
    var TestResource = $resource('/api/tests/:id', {_id: "@id"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return TestResource;
});
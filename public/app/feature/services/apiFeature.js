angular.module('app').factory('apiFeature', function($resource) {
    var FeatureResource = $resource('/api/features/:id', {_id: "@id"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return FeatureResource;
});
angular.module('app').factory('mvTestStep', function($resource) {
    var TestStepResource = $resource('/api/testSteps/:id', {_id: "@id"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return TestStepResource;
});
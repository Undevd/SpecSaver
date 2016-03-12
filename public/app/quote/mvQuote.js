angular.module('app').factory('mvQuote', function($resource) {
    var QuoteResource = $resource('/api/quotes/:id', {_id: "@id"}, {
        query: {method:'GET', isArray:true, cancellable:true },
        update: {method:'PUT', isArray:false}
    });
    
    return QuoteResource;
});
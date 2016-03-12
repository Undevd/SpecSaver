angular.module('app').factory('mvQuote', function($resource) {
    var QuoteResource = $resource('/api/quotes/:id', {_id: "@id"}, {
        update: {method:'PUT', isArray:false}
    });
    
    return QuoteResource;
});
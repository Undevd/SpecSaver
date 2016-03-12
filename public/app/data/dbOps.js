angular.module('app').factory('dbOps', function($http, $q, mvQuote) {
  return {
    createQuote: function(newQuoteData) {
      var newQuote = new mvQuote(newQuoteData);
      var dfd = $q.defer();

      newQuote.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  }
});
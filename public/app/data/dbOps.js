angular.module('app').factory('dbOps', function($http, $q, mvQuote, mvVote, mvUserStory) {
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
    },
    createVote: function(newVoteData) {
      var newVote = new mvVote(newVoteData);
      var dfd = $q.defer();

      newVote.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    createUserStory: function(newUserStoryData) {
      var newUserStory = new mvUserStory(newUserStoryData);
      var dfd = $q.defer();

      newUserStory.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      
      return dfd.promise;
    }
  }
});
angular.module('app').factory('dbOps', function($http, $q, mvQuote, mvVote, mvTest, mvUserStory, mvTestStep) {
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

    createTest: function(newTestData) {
      var newTest = new mvTest(newTestData);
      var dfd = $q.defer();

      newTest.$save().then(function() {
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
    },
    
    createTestStep: function(newTestStepData) {
      var newTestStep = new mvTestStep(newTestStepData);
      var dfd = $q.defer();

      newTestStep.$save().then(function() {
          dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },
  }
});
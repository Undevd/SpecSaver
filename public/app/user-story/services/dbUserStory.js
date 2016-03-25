angular.module('app').factory('dbUserStory', function(apiUserStory) {
  return {
    createUserStory: function(newUserStoryData) {
      return new apiUserStory(newUserStoryData).$save();
    },
    
    getAllUserStories: function(projectCode, featureCode) {
      return apiUserStory.query({projectCode: projectCode, featureCode: featureCode});
    },

    getAllUserStoriesCount: function(projectCode, featureCode) {
      return apiUserStory.queryCount({projectCode: projectCode, featureCode: featureCode});
    },

    getUserStory: function(projectCode, userStoryCode) {
      return apiUserStory.queryOne({projectCode: projectCode, featureCode: featureCode, userStoryCode: userStoryCode});
    },

    updateUserStory: function(newUserStoryData) {
      return apiUserStory.update(newUserStoryData);
    }
  }
});
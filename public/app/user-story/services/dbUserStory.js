angular.module('app').factory('dbUserStory', function(apiUserStory) {
  return {
    createUserStory: function(newUserStoryData) {
      return new apiUserStory(newUserStoryData).$save();
    },
    
    getAllUserStories: function(projectCode, featureCode) {
      return apiUserStory.getAll({projectCode: projectCode, featureCode: featureCode});
    },

    getUserStory: function(projectCode, featureCode, userStoryCode) {
      return apiUserStory.getOne({projectCode: projectCode, featureCode: featureCode, userStoryCode: userStoryCode});
    },

    searchForUserStory: function(projectCode, criteria) {
      return apiUserStory.search({projectCode: projectCode, criteria: criteria});
    },

    updateUserStory: function(newUserStoryData) {
      return apiUserStory.update(newUserStoryData);
    }
  }
});
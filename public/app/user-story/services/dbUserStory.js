angular.module('app').factory('dbUserStory', function(apiUserStory) {
  return {
    createUserStory: function(newUserStoryData) {
      return new apiUserStory(newUserStoryData).$save();
    },
    
    getAllUserStories: function(projectCode, featureCode) {
      return apiUserStory.getAll({projectCode: projectCode, featureCode: featureCode});
    },

    getUserStory: function(projectCode, userStoryCode) {
      return apiUserStory.getOne({projectCode: projectCode, featureCode: featureCode, userStoryCode: userStoryCode});
    },

    getUserStoryCount: function(projectCode, featureCode) {
      return apiUserStory.countFor({projectCode: projectCode, featureCode: featureCode});
    },

    getUserStoryCountGrouped: function(projectCode) {
      return apiUserStory.countGrouped({projectCode: projectCode});
    },

    updateUserStory: function(newUserStoryData) {
      return apiUserStory.update(newUserStoryData);
    }
  }
});
angular.module('app').factory('dbAcceptanceTest', function(apiAcceptanceTest) {
  return {
    createAcceptanceTest: function(newAcceptanceTestData) {
      return new apiAcceptanceTest(newAcceptanceTestData).$save();
    },
    
    getAllUserStories: function(projectCode, featureCode, userStoryCode) {
      return apiAcceptanceTest.getAll({projectCode: projectCode, featureCode: featureCode, userStoryCode: userStoryCode});
    },

    getAcceptanceTest: function(projectCode, featureCode, acceptanceTestCode) {
      return apiAcceptanceTest.getOne({projectCode: projectCode, featureCode: featureCode, acceptanceTestCode: acceptanceTestCode});
    },

    getAcceptanceTestCount: function(projectCode, featureCode, userStoryCode) {
      return apiAcceptanceTest.countFor({projectCode: projectCode, featureCode: featureCode, userStoryCode: userStoryCode});
    },

    getAcceptanceTestCountGrouped: function(projectCode, featureCode) {
      return apiAcceptanceTest.countGrouped({projectCode: projectCode, featureCode: featureCode});
    },

    updateAcceptanceTest: function(newAcceptanceTestData) {
      return apiAcceptanceTest.update(newAcceptanceTestData);
    }
  }
});
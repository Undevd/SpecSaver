angular.module('app').factory('dbAcceptanceTest', function(apiAcceptanceTest) {
  return {
    createAcceptanceTest: function(newAcceptanceTestData) {
      return new apiAcceptanceTest(newAcceptanceTestData).$save();
    },
    
    getAllAcceptanceTests: function(projectCode, featureCode, userStoryCode) {
      return apiAcceptanceTest.getAll({projectCode: projectCode, featureCode: featureCode, userStoryCode: userStoryCode});
    },

    getAcceptanceTest: function(projectCode, featureCode, acceptanceTestCode) {
      return apiAcceptanceTest.getOne({projectCode: projectCode, featureCode: featureCode, acceptanceTestCode: acceptanceTestCode});
    },

    searchForAcceptanceTest: function(projectCode, criteria) {
      return apiAcceptanceTest.search({projectCode: projectCode, criteria: criteria});
    },

    updateAcceptanceTest: function(newAcceptanceTestData) {
      return apiAcceptanceTest.update(newAcceptanceTestData);
    }
  }
});
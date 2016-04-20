angular.module('app').factory('dbSystemTest', function(apiSystemTest) {
  return {
    createSystemTest: function(newSystemTestData) {
      return new apiSystemTest(newSystemTestData).$save();
    },
    
    getAllSystemTests: function(projectCode, releaseCode) {
      return apiSystemTest.getAll({projectCode: projectCode});
    },

    getSystemTest: function(projectCode, systemTestCode) {
      return apiSystemTest.getOne({projectCode: projectCode, systemTestCode: systemTestCode});
    },

    updateSystemTest: function(newSystemTestData) {
      return apiSystemTest.update(newSystemTestData);
    }
  }
});
angular.module('app').factory('dbTestStep', function(apiTestStep) {
  return {
    createTestStep: function(newTestStepData) {
      return new apiTestStep(newTestStepData).$save();
    },
    
    getAllTestSteps: function(projectCode, releaseCode) {
      return apiTestStep.getAll({projectCode: projectCode});
    },

    getTestStep: function(projectCode, testStepCode) {
      return apiTestStep.getOne({projectCode: projectCode, testStepCode: testStepCode});
    },

    updateTestStep: function(newTestStepData) {
      return apiTestStep.update(newTestStepData);
    }
  }
});
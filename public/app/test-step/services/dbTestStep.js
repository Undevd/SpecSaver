angular.module('app').factory('dbTestStep', function(apiTestStep) {
	return {
		createTestStep: function(newTestStepData) {
			return new apiTestStep(newTestStepData).$save();
		},

		getAllTestSteps: function(projectCode) {
			return apiTestStep.getAll({projectCode: projectCode});
		},

		getTestStep: function(projectCode, testStepCode) {
			return apiTestStep.getOne({projectCode: projectCode, testStepCode: testStepCode});
		},

		getTestStep: function(projectCode, testStepCode) {
			return apiTestStep.getOne({projectCode: projectCode, testStepCode: testStepCode});
		},

		searchForTestStep: function(projectCode, type, step) {
		  return apiTestStep.search({projectCode: projectCode, type: type, step: step});
		},

		updateTestStep: function(newTestStepData) {
			return apiTestStep.update(newTestStepData);
		}
	};
});
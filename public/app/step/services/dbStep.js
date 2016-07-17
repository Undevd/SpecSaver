angular.module('app').factory('dbStep', function(apiStep) {
	return {
		addStep: function(stepData) {
			return apiStep.add(stepData);
		},

		createStep: function(newStepData) {
			return new apiStep(newStepData).$save();
		},

		getAllSteps: function(projectCode) {
			return apiStep.getAll({projectCode: projectCode});
		},

		getStep: function(projectCode, stepCode) {
			return apiStep.getOne({projectCode: projectCode, stepCode: stepCode});
		},

		searchForStep: function(projectCode, type, step) {
		  return apiStep.search({projectCode: projectCode, type: type, step: step});
		},

		updateStep: function(newStepData) {
			return apiStep.update(newStepData);
		}
	};
});
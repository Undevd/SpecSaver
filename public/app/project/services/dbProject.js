angular.module('app').factory('dbProject', function(apiProject) {
	return {
		createProject: function(newProjectData) {
			return new apiProject(newProjectData).$save();
		},

		exportProject: function(projectCode) {
			return apiProject.export({projectCode: projectCode});
		},

		getAllProjects: function() {
			return apiProject.getAll();
		},

		getProject: function(projectCode) {
			return apiProject.getOne({projectCode: projectCode});
		},

		importProject: function(projectData) {
			return apiProject.import(projectData);
		},

		updateProject: function(newProjectData) {
			return apiProject.update(newProjectData);
		}
	};
});
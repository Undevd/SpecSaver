angular.module('app').factory('dbProject', function(apiProject) {
  return {
    createProject: function(newProjectData) {
      return new apiProject(newProjectData).$save();
    },
    
    getAllProjects: function() {
      return apiProject.query();
    },

    getProject: function(projectCode) {
      return apiProject.queryOne({projectCode: projectCode});
    },

    updateProject: function(newProjectData) {
      return apiProject.update(newProjectData);
    }
  }
});
angular.module('app').factory('dbProject', function(apiProject) {
  return {
    createProject: function(newProjectData) {
      return new apiProject(newProjectData).$save();
    },
    
    getAllProjects: function() {
      return apiProject.query();
    },

    getProject: function(projectId) {
      return apiProject.queryOne({projectId: projectId});
    },

    updateProject: function(newProjectData) {
      return apiProject.update(newProjectData);
    }
  }
});
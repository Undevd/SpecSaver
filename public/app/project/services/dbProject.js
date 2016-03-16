angular.module('app').factory('dbProject', function($http, $q, apiProject) {
  return {
    
    createProject: function(newProjectData) {
      var newProject = new apiProject(newProjectData);
      var dfd = $q.defer();

      newProject.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    getAllProjects: function()
    {
      return apiProject.query();
    },

    getProject: function(projectId)
    {
      return apiProject.query({ projectId: projectId });
    }
  }
});
angular.module('app').factory('dbRelease', function(apiRelease) {
  return {
    createRelease: function(newReleaseData) {
      return new apiRelease(newReleaseData).$save();
    },
    
    getAllReleases: function(projectId) {
      return apiRelease.query({projectId: projectId});
    },

    getRelease: function(projectId, releaseId) {
      return apiRelease.query({projectId: projectId, releaseId: releaseId});
    }
  }
});
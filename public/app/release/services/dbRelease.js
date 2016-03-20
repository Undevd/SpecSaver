angular.module('app').factory('dbRelease', function(apiRelease) {
  return {
    createRelease: function(newReleaseData) {
      return new apiRelease(newReleaseData).$save();
    },
    
    getAllReleases: function(projectId) {
      return apiRelease.query({projectId: projectId});
    },

    getAllReleasesCount: function(projectId) {
      return apiRelease.queryCount({projectId: projectId});
    },

    getRelease: function(projectId, releaseId) {
      return apiRelease.queryOne({projectId: projectId, releaseId: releaseId});
    },

    updateRelease: function(newReleaseData) {
      return apiRelease.update(newReleaseData);
    }
  }
});
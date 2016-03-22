angular.module('app').factory('dbRelease', function(apiRelease) {
  return {
    createRelease: function(newReleaseData) {
      return new apiRelease(newReleaseData).$save();
    },
    
    getAllReleases: function(projectCode) {
      return apiRelease.query({projectCode: projectCode});
    },

    getAllReleasesCount: function(projectCode) {
      return apiRelease.queryCount({projectCode: projectCode});
    },

    getRelease: function(projectCode, releaseId) {
      return apiRelease.queryOne({projectCode: projectCode, releaseId: releaseId});
    },

    updateRelease: function(newReleaseData) {
      return apiRelease.update(newReleaseData);
    }
  }
});
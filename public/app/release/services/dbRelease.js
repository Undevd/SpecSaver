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

    getRelease: function(projectCode, releaseCode) {
      return apiRelease.queryOne({projectCode: projectCode, releaseCode: releaseCode});
    },

    updateRelease: function(newReleaseData) {
      return apiRelease.update(newReleaseData);
    }
  }
});
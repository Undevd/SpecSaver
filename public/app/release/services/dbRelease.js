angular.module('app').factory('dbRelease', function(apiRelease) {
  return {
    createRelease: function(newReleaseData) {
      return new apiRelease(newReleaseData).$save();
    },
    
    getAllReleases: function(projectCode) {
      return apiRelease.getAll({projectCode: projectCode});
    },

    getRelease: function(projectCode, releaseCode) {
      return apiRelease.getOne({projectCode: projectCode, releaseCode: releaseCode});
    },

    updateRelease: function(newReleaseData) {
      return apiRelease.update(newReleaseData);
    }
  }
});
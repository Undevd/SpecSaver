angular.module('app').factory('dbRelease', function($q, apiRelease) {
  return {
    createRelease: function(newReleaseData) {
      return new apiRelease(newReleaseData).$save();
    },
    
    getAllReleases: function() {
      return apiRelease.query();
    }
  }
});
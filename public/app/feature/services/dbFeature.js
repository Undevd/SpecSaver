angular.module('app').factory('dbFeature', function(apiFeature) {
  return {
    createFeature: function(newFeatureData) {
      return new apiFeature(newFeatureData).$save();
    },
    
    getAllFeatures: function(projectCode, releaseId) {
      return apiFeature.query({projectCode: projectCode, releaseId: releaseId});
    }
  }
});
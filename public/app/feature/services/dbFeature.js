angular.module('app').factory('dbFeature', function(apiFeature) {
  return {
    createFeature: function(newFeatureData) {
      return new apiFeature(newFeatureData).$save();
    },
    
    getAllFeatures: function(projectId, releaseId) {
      return apiFeature.query({projectId: projectId, releaseId: releaseId});
    }
  }
});
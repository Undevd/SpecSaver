angular.module('app').factory('dbFeature', function(apiFeature) {
  return {
    createFeature: function(newFeatureData) {
      return new apiFeature(newFeatureData).$save();
    },
    
    getAllFeatures: function() {
      return apiFeature.query();
    }
  }
});
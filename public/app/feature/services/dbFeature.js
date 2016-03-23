angular.module('app').factory('dbFeature', function(apiFeature) {
  return {
    createFeature: function(newFeatureData) {
      return new apiFeature(newFeatureData).$save();
    },
    
    getAllFeatures: function(projectCode, releaseCode) {
      return apiFeature.query({projectCode: projectCode, releaseCode: releaseCode});
    },

    getAllFeaturesCount: function(projectCode) {
      return apiFeature.queryCount({projectCode: projectCode});
    },

    getFeature: function(projectCode, featureCode) {
      return apiFeature.queryOne({projectCode: projectCode, featureCode: featureCode});
    },

    updateFeature: function(newFeatureData) {
      return apiFeature.update(newFeatureData);
    }
  }
});
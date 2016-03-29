angular.module('app').factory('dbFeature', function(apiFeature) {
  return {
    createFeature: function(newFeatureData) {
      return new apiFeature(newFeatureData).$save();
    },
    
    getAllFeatures: function(projectCode, releaseCode) {
      return apiFeature.getAll({projectCode: projectCode, releaseCode: releaseCode});
    },

    getFeature: function(projectCode, featureCode) {
      return apiFeature.getOne({projectCode: projectCode, featureCode: featureCode});
    },

    getFeatureCount: function(projectCode, releaseCode) {
      return apiFeature.countFor({projectCode: projectCode, releaseCode: releaseCode});
    },

    updateFeature: function(newFeatureData) {
      return apiFeature.update(newFeatureData);
    }
  }
});
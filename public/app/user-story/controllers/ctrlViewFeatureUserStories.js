angular.module('app').controller('ctrlViewFeatureUserStories', function($scope, $routeParams, dbFeature, dbProject, dbUserStory) {
    
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    $scope.userStories = dbUserStory.getAllUserStories(projectCode, featureCode);

    $scope.project = dbProject.getProject(projectCode);

    $scope.feature = dbFeature.getFeature(projectCode, featureCode);
});
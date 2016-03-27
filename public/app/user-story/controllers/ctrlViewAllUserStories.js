angular.module('app').controller('ctrlViewAllUserStories', function($scope, $routeParams, dbFeature, dbProject, dbUserStory) {
    
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    $scope.userStories = dbUserStory.getAllUserStories(projectCode, featureCode);

    $scope.project = dbProject.getProject(projectCode);

    if (featureCode)
    {
    	$scope.feature = dbFeature.getFeature(projectCode, featureCode);
    }
});
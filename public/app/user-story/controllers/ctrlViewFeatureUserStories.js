angular.module('app').controller('ctrlViewFeatureUserStories', function($scope, $rootScope, $routeParams, dbFeature, dbProject, dbUserStory) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode;

    //Get the user stories associated with the feature
    $scope.userStories = dbUserStory.getAllUserStories(projectCode, featureCode);

    //Get the project data
    $scope.project = dbProject.getProject(projectCode);

    //Get the feature data
    $scope.feature = dbFeature.getFeature(projectCode, featureCode);
});
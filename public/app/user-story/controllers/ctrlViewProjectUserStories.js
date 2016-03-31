angular.module('app').controller('ctrlViewProjectUserStories', function($scope, $rootScope, $routeParams, dbFeature, dbProject, dbUserStory) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

    //Get the number of user stories grouped by feature
    $scope.features = dbUserStory.getUserStoryCountGrouped(projectCode);

    //Get the project associated with the user stories
    $scope.project = dbProject.getProject(projectCode);
});
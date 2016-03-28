angular.module('app').controller('ctrlViewProjectUserStories', function($scope, $routeParams, dbFeature, dbProject, dbUserStory) {
    
    var projectCode = $routeParams.projectCode;

    //Get the number of user stories grouped by feature
    $scope.features = dbUserStory.getUserStoryCountGrouped(projectCode);

    //Get the project associated with the user stories
    $scope.project = dbProject.getProject(projectCode);
});
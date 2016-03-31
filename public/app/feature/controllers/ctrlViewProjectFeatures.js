angular.module('app').controller('ctrlViewProjectFeatures', function($scope, $rootScope, $routeParams, dbFeature, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

	//Get the features associated with the project
    $scope.features = dbFeature.getAllFeatures(projectCode);

    //Get the project data
    $scope.project = dbProject.getProject(projectCode);
});
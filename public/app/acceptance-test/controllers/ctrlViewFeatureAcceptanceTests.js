angular.module('app').controller('ctrlViewFeatureAcceptanceTests', function($scope, $rootScope, $routeParams, dbAcceptanceTest, dbFeature, dbProject) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;
    var featureCode = $routeParams.featureCode;

    //Set the page title
    $rootScope.title += projectCode + '-' + featureCode;

    //Get the acceptance tests associated with the feature
    $scope.acceptanceTests = dbAcceptanceTest.getAllAcceptanceTests(projectCode, featureCode);

    //Get the project data
    $scope.project = dbProject.getProject(projectCode);

    //Get the feature data
    $scope.feature = dbFeature.getFeature(projectCode, featureCode);
});
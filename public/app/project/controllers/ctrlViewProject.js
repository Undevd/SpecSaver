angular.module('app').controller('ctrlViewProject', function($scope, $rootScope, $location, $routeParams, dbFeature, dbProject, dbRelease, dbUserStory) {
    
    //Get the route parameters
    var projectCode = $routeParams.projectCode;

    //Set the page title
    $rootScope.title += projectCode;

	//Get data related to the project
	dbProject.getProject(projectCode).$promise.then(function(project)
    {
        //Store the project in the scope
        $scope.project = project;

        //Get the number of releases associated with the project
        $scope.release = dbRelease.getReleaseCount(projectCode);

        //Get the number of features associated with the project
        $scope.feature = dbFeature.getFeatureCount(projectCode);

        //Get the number of user stories associated with the project
        $scope.userStory = dbUserStory.getUserStoryCount(projectCode);

        //Record whether a field is being edited
        $scope.edit = {};

        //Store the old value of a field as it is being edited
        $scope.oldData = {};

        $scope.showEdit = function(field, show) {
            if (show) {
                //Store the old data
                $scope.oldData[field] = $scope.project[field];
            }

            //Show the edit fields
            $scope.edit[field] = show;
        }

        $scope.cancelEdit = function(field) {
            //Reset the value
            $scope.project[field] = $scope.oldData[field];

            //Stop editing
            $scope.showEdit(field, false);
        }

        $scope.submitEdit = function(field) {
            //Save the project
            dbProject.updateProject($scope.project);

            //Stop editing
            $scope.showEdit(field, false);
        }
    }, function(reason) {
        //Redirect to the 404 page
        $location.path('/404');
    });
});
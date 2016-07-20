angular.module('app').controller('ctrlViewAllProjects', function($scope, $location, dbProject) {

    //Set the navigation settings
    $scope.nav = {
        project: {isCurrentSection: true}
    };

	//Get all projects
    dbProject.getAllProjects().$promise.then(function(projects) {

    	//Store the projects in the scope
    	$scope.projects = projects;

        //Set the clickable row URL function
        $scope.goTo = function(projectCode) {
            $location.path('/p/' + projectCode);
        };

        //Imports the project using the supplied JSON
        $scope.importProject = function() {

            //Import the project
            dbProject.importProject($scope.imported).$promise.then(function(data) {

                //Hide the dialog before redirecting to avoid the modal fade overlay remaining (JQuery)
                $('div.modal').removeClass('fade').addClass('hidden');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();

                //Redirect to view the new/updated project
                $location.path('/p/' + data.code);

            }, function(error) {
                
                //Add the error message to the scope
                $scope.importProjectError = error.data.message;
            });
        };
    	
    }, function(error) {
        
        //Redirect to the error page
        $location.path('/' + error.status);
    });
});
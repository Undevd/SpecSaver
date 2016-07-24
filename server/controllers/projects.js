var AcceptanceTest = require('mongoose').model('AcceptanceTest');
var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var Release = require('mongoose').model('Release');
var SystemTest = require('mongoose').model('SystemTest');
var UserStory = require('mongoose').model('UserStory');

//Creates a new project
exports.createProject = function(request, response) {

    //Create the project
    Project.createProject(request.body).then(function(code) {

        //Set the success status and send the new project code
        response.status(201).send({code: code});

    }, function(error) {

        //Set the error status and send the error message
        response.status(400).send({code: error.code, message: error.errmsg});
    });
}

//Export the current project to JSON
exports.exportProject = function(request, response) {

    //Get all projects sorted by name
    Project.exportProject(request.params.projectCode).then(function(project) {

        //Set the success status and send the project
        response.status(200).send(project);

    }, function(error) {

        //Set the error status and send the error message
        response.status(400).send({code: error.code, message: error.errmsg});
    });
}

//Gets all created projects
exports.getAllProjects = function(request, response) {

    //Get all projects sorted by name
    Project.getAllProjects().then(function(projects) {

        //Set the success status and send the projects
        response.status(200).send(projects);

    }, function(error) {

        //Set the error status and send the error message
        response.status(400).send({code: error.code, message: error.errmsg});
    });
}

//Gets the project with the supplied project code
exports.getProject = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the release statistics
    var releaseStats = Release.getReleaseStatsForProject(request.params.projectCode);

    //Get the feature statistics
    var featureStats = Feature.getFeatureStatsForProject(request.params.projectCode);

    //Get the user story statistics
    var userStoryStats = UserStory.getUserStoryStatsForProject(request.params.projectCode);

    //Get the acceptance test statistics
    var acceptanceTestStats = AcceptanceTest.getAcceptanceTestStatsForProject(request.params.projectCode);

    //Get the system test statistics
    var systemTestStats = SystemTest.getSystemTestStatsForProject(request.params.projectCode);

    //If all the promises are successful
    Promise.all([project, releaseStats, featureStats, userStoryStats, acceptanceTestStats, systemTestStats]).then(function(data) {
        
        //Set the success status and send the project and features data
        response.status(200).send({
            project: data[0],
            stats: {
                release: data[1],
                feature: data[2],
                userStory: data[3],
                acceptanceTest: data[4],
                systemTest: data[5]
            }
        });

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
}

//Imports the supplied project
exports.importProject = function(request, response) {

    //Get the data from the request
    var data = request.body;

    //If data was supplied
    if (data) {

        //Store an array of the populated promises
        var promises = [];

        //If the project was supplied
        if (data.project && data.project.code) {

            //Create or update the project
            promises.push(Project.createOrUpdateProject(data.project));
        }

        //If any releases were supplied
        if (data.releases) {

            //For each release
            for (var release of data.releases) {
                
                //Create or update it
                promises.push(Release.createOrUpdateRelease(release));
            }
        }

        //If any features were supplied
        if (data.features) {

            //For each feature
            for (var feature of data.features) {
                
                //Create or update it
                promises.push(Feature.createOrUpdateFeature(feature));
            }
        }

        //If any user stories were supplied
        if (data.userStories) {

            //For each user story
            for (var userStory of data.userStories) {
                
                //Create or update it
                promises.push(UserStory.createOrUpdateUserStory(userStory));
            }
        }

        //If any acceptance tests were supplied
        if (data.acceptanceTests) {

            //For each acceptance test
            for (var acceptanceTest of data.acceptanceTests) {
                
                //Create or update it
                promises.push(AcceptanceTest.createOrUpdateAcceptanceTest(acceptanceTest));
            }
        }

        //If any system tests were supplied
        if (data.systemTests) {

            //For each system test
            for (var systemTest of data.systemTests) {
                
                //Create or update it
                promises.push(SystemTest.createOrUpdateSystemTest(systemTest));
            }
        }

        //If no valid data has been supplied
        if (!promises.length) {

            //Return an error
            response.status(400).send({code: 400, message: 'No valid data supplied'});
        }

        //If all the promises are successful
        Promise.all(promises).then(function(responses) {
            
            //Set the success status and send the project code
            response.status(200).send({code: responses[0]});

        }, function(error) {
            
            //Otherwise, set the error status and send the error message
            response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
        });
    }
}

//Updates the project with the supplied project code
exports.updateProject = function(request, response) {
    
    //Update the project
    Project.updateProject(request.body).then(function(code) {

        //Set the success status and send the project code
        response.status(200).send({code: code});

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
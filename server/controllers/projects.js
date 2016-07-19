var AcceptanceTest = require('mongoose').model('AcceptanceTest');
var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var Release = require('mongoose').model('Release');
var SystemTest = require('mongoose').model('SystemTest');
var UserStory = require('mongoose').model('UserStory');

//Creates a new project
exports.createProject = function(request, response) {

    //Get the project data from the request
    var projectData = request.body;

    //Sanitise the data
    var newProjectData = {
        name: projectData.name,
        code: projectData.code,
        description: projectData.description,
        admins: projectData.admins,
        members: projectData.members
    };

    //Create the project
    Project.createProject(newProjectData).then(function(code) {

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

//Updates the project with the supplied project code
exports.updateProject = function(request, response) {
    
    //Get the project data from the request
    var projectData = request.body;

    //Sanitise the data
    var newProjectData = {
        name: projectData.name,
        code: projectData.code,
        description: projectData.description,
        admins: projectData.admins,
        members: projectData.members
    };

    //Update the project
    Project.updateProject(newProjectData).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
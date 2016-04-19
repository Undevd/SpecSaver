var AcceptanceTest = require('mongoose').model('AcceptanceTest');
var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
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

    //Get the feature statistics
    var featureStats = Feature.getFeatureStatsForProject(request.params.projectCode);

    //Get the user story statistics
    var userStoryStats = UserStory.getUserStoryStatsForProject(request.params.projectCode);

    //Get the acceptance test statistics
    var acceptanceTestStats = AcceptanceTest.getAcceptanceTestStatsForProject(request.params.projectCode);

    //If all the promises are successful
    Promise.all([project, featureStats, userStoryStats, acceptanceTestStats]).then(function(data) {
        
        //Set the success status and send the project and features data
        response.status(200).send({project: data[0], stats: {feature: data[1], userStory: data[2], acceptanceTest: data[3]}});

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
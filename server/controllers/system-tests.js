var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var Step = require('mongoose').model('Step');
var SystemTest = require('mongoose').model('SystemTest');

//Creates a new system test
exports.createSystemTest = function(request, response) {

    //Create the system test
    SystemTest.createSystemTest(request.body).then(function(data) {

        //Set the success status and send the new system test and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all created system tests by project
exports.getAllSystemTestsByProject = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the system tests
    var systemTests = SystemTest.getAllSystemTestsByProject(request.params.projectCode);

    //If all the promises are successful
    Promise.all([project, systemTests]).then(function(data) {
        
        //Set the success status and send the project and system tests data
        response.status(200).send({project: data[0], systemTests: data[1]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets the system test with the supplied system test code
exports.getSystemTest = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the system test and test steps
    var systemTest = SystemTest.getSystemTestExpanded(request.params.projectCode, request.params.systemTestCode);

    //If all the promises are successful
    Promise.all([project, systemTest]).then(function(data) {
        
        //Set the success status and send the feature, project, system test, and test step data
        response.status(200).send({
            acceptanceTests: data[1].acceptanceTests,
            features: data[1].features,
            project: data[0],
            systemTest: data[1].systemTest,
            steps: data[1].steps,
            userStories: data[1].userStories
        });

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing system test
exports.updateSystemTest = function(request, response) {
    
    //Update the system test
    SystemTest.updateSystemTest(request.body).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
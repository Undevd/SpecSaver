var Project = require('mongoose').model('Project');
var SystemTest = require('mongoose').model('SystemTest');

//Creates a new system test
exports.createSystemTest = function(request, response) {

    //Get the system test data from the request
    var systemTestData = request.body;

    //Sanitise the data
    var newSystemTestData = {
        name: systemTestData.name,
        code: null,
        description: systemTestData.description,
        projectCode: systemTestData.projectCode
    };

    //Create the systemTest
    SystemTest.createSystemTest(newSystemTestData).then(function(data) {

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

    //Get the system test
    var systemTest = SystemTest.getSystemTest(request.params.projectCode, request.params.systemTestCode);

    //If all the promises are successful
    Promise.all([project, systemTest]).then(function(data) {
        
        //Set the success status and send the project and system test data
        response.status(200).send({project: data[0], systemTest: data[1]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing system test
exports.updateSystemTest = function(request, response) {
    
    //Get the system test data from the request
    var systemTestData = request.body;

    //Sanitise the data
    var newSystemTestData = {
        name: systemTestData.name,
        code: systemTestData.code,
        description: systemTestData.description,
        projectCode: systemTestData.projectCode
    };

    //Update the system test
    SystemTest.updateSystemTest(newSystemTestData).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
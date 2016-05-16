var SystemTest = require('mongoose').model('SystemTest');
var TestStep = require('mongoose').model('TestStep');

//Adds a test step to a system test at the specified position
exports.addTestStep = function(request, response) {

    //Search for any matching results
    TestStep.addTestStep(request.body).then(function(data) {

        //Get the updated system test and test steps
        SystemTest.getSystemTestAndTestStepsExpanded(request.body.projectCode, request.body.systemTestCode).then(function(data) {

            //Set the success status and send the system test data
            response.status(200).send({systemTest: data.systemTest, testSteps: data.testSteps});

        }, function(error) {
            
            //Otherwise, set the error status and send the error message
            response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
        });

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Creates a new test step
exports.createTestStep = function(request, response) {

    //Get the system test data from the request
    var testStepData = request.body;

    //Sanitise the data
    var newTestStepData = {
        code: null,
        type: testStepData.type,
        step: testStepData.step,
        projectCode: testStepData.projectCode
    };

    //Create the system test
    TestStep.createTestStep(newTestStepData).then(function(data) {

        //Set the success status and send the new test step and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

exports.getTestSteps = function(req, res) {
    TestStep.find({}).exec(function(err, testSteps) {
        res.send(testSteps);
    })
};

//Searches for a test step using the supplied Project Code, Type, and Step criteria
exports.searchForTestStep = function(request, response) {

    //Get the search criteria from the request
    var projectCode = request.params.projectCode;
    var type = request.params.type;
    var step = request.params.step;

    //Search for any matching results
    TestStep.searchForTestStep(projectCode, type, step).then(function(data) {

        //Set the success status and send the search results
        response.status(200).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
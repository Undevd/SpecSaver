var Step = require('mongoose').model('Step');
var SystemTest = require('mongoose').model('SystemTest');

//Adds a test step to a system test at the specified position
exports.addStep = function(request, response) {

    //Search for any matching results
    Step.addStep(request.body).then(function(data) {

        //Get the updated system test and test steps
        SystemTest.getSystemTestExpanded(request.body.projectCode, request.body.systemTestCode).then(function(data) {

            //Set the success status and send the feature, system test, and test step data
            response.status(200).send({
                features: data.features,
                systemTest: data.systemTest,
                steps: data.steps
            });

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
exports.createStep = function(request, response) {

    //Create the step
    Step.createStep(request.body).then(function(data) {

        //Set the success status and send the new test step and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

exports.getSteps = function(req, res) {
    Step.find({}).exec(function(err, steps) {
        res.send(steps);
    })
};

//Searches for a test step using the supplied Project Code, Type, and Step criteria
exports.searchForStep = function(request, response) {

    //Get the search criteria from the request
    var projectCode = request.params.projectCode;
    var type = request.params.type;
    var step = request.params.step;

    //Search for any matching results
    Step.searchForStep(projectCode, type, step).then(function(data) {

        //Set the success status and send the search results
        response.status(200).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing test step
exports.updateStep = function(request, response) {

    //Update the step
    Step.updateStep(request.body).then(function(data) {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
var TestStep = require('mongoose').model('TestStep');

exports.getTestSteps = function(req, res) {
    TestStep.find({}).exec(function(err, testSteps) {
        res.send(testSteps);
    })
};

exports.createTestStep = function(req, res) {
    var testStepData = req.body;
    TestStep.create(testStepData, function(err, testStep) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(201);
        res.send(testStep);
    });
}

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
}
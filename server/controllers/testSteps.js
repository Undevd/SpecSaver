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
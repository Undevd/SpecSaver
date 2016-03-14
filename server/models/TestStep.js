var mongoose = require('mongoose');

var testStepSchema = mongoose.Schema({
    description: { type:String, required:'{PATH} is required'}
});

testStepSchema.methods = { };

var TestStep = mongoose.model('TestStep', testStepSchema);

function createInitialTestSteps() {
    TestStep.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            TestStep.create({description: 'When I add a test test.'});
        }
    });
}

exports.createInitialTestSteps = createInitialTestSteps;
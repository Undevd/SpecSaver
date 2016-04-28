var mongoose = require('mongoose');

var testStepSchema = mongoose.Schema({
    code: {type: String, required: '{PATH} is required'},
    type: {type: String, required: '{PATH} is required'},
    step: {type: String, required: '{PATH} is required'},
    projectCode: {type:String, required: '{PATH} is required'}
});

testStepSchema.index({code: 1, projectCode: 1}, {unique: true});

//Gets all test steps by project code and type, containing the step criteria
testStepSchema.statics.searchForTestStep = function searchForTestStep(projectCode, type, step) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the test steps
        mongoose.model('TestStep').find({projectCode: projectCode, type: type, step: {$regex : step}}, '-_id code projectCode step type').sort({type: 1, step: 1}).exec(function(error, testSteps) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the test steps
                resolve(testSteps);
            }
        });
    });
};

var TestStep = mongoose.model('TestStep', testStepSchema);
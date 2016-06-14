var mongoose = require('mongoose');

var testStepSchema = mongoose.Schema({
    code: {type: Number, required: '{PATH} is required'},
    type: {type: String, required: '{PATH} is required'},
    step: {type: String, required: '{PATH} is required'},
    projectCode: {type:String, required: '{PATH} is required'}
});

testStepSchema.index({code: 1, projectCode: 1}, {unique: true});

//Adds a test step to the system test
testStepSchema.statics.addTestStep = function addTestStep(newTestStepData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the system test
        var systemTest = mongoose.model('SystemTest')
            .getSystemTestAndTestSteps(newTestStepData.projectCode, newTestStepData.systemTestCode);

        //Check if the test step exists
        var testStepExists = mongoose.model('TestStep')
            .exists(newTestStepData.projectCode, newTestStepData.code);

        //If all the promises are successful
        Promise.all([systemTest, testStepExists]).then(function(data) {

            //Get the system test data
            var systemTestData = data[0];

            //Record the new data to save
            var newDataToSave = {
                code: newTestStepData.code,
                arguments: newTestStepData.arguments
            };

            //If a test step is being edited
            if (newTestStepData.isEdit) {
                
                //Overwrite the test step data in the required position
                systemTestData.testStepArguments[newTestStepData.position] = newDataToSave;
            }
            else {
                
                //Add the test step to the required position
                systemTestData.testStepArguments.splice(newTestStepData.position, 0, newDataToSave);
            }

            //Update the system test
            var newSystemTest = mongoose.model('SystemTest').updateSystemTest(systemTestData);

            //If all the promises are successful
            Promise.all([newSystemTest]).then(function(data) {

                //Return with the data
                resolve(data);

            }, function(error) {

                //Return the error
                reject(error);
            });
        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
};

//Creates a new test step
testStepSchema.statics.createTestStep = function createTestStep(newTestStepData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Check if the project exists
        var projectExists = mongoose.model('Project').exists(newTestStepData.projectCode);

        //Find the newest test step
        var testStepCode = mongoose.model('TestStep').getNextCode(newTestStepData.projectCode);

        //If all the promises are successful
        Promise.all([projectExists, testStepCode]).then(function(data) {
            
            //Set the test step code
            newTestStepData.code = data[1];

            //Create the test step
            mongoose.model('TestStep').create(newTestStepData, function(error, testStep) {

                //If an error occurred
                if(error) {

                    //If the error code was 11000
                    if (error.code == 11000) {

                        //Update the error message to be more user friendly
                        error.errmsg = 'A test step with the same code already exists.';
                    }

                    //Return the error
                    reject(error);
                }
                else {

                    //Otherwise, return the test step and project code
                    resolve({code: testStep.code, projectCode: testStep.projectCode});
                }
            });
        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
};

//Checks whether the test step with the supplied code exists
testStepSchema.statics.exists = function exists(projectCode, testStepCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the number of test steps by code
        mongoose.model('TestStep')
            .count({code: testStepCode, projectCode: projectCode})
            .exec(function(error, count) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the test step couldn't be found
            else if (!count) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Test step not found'});
            }
            //Else if multiple test steps were found
            else if (count > 1) {

                //Return a 400 error
                reject({code: 400, errmsg: 'Multiple test steps found with the same code'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
};

//Gets the next unassigned code for a new test step
testStepSchema.statics.getNextCode = function getNextCode(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the latest system test
        mongoose.model('TestStep')
            .findOne({projectCode: projectCode})
            .sort('-code')
            .exec(function(error, latestTestStep) {
            
            //If an error occurred
            if(error) {

                //Return the error
                reject(error);
            }
            else {

                //Return a new code for the test step, starting from 1 if none exists
                resolve(latestTestStep == null? 1 : latestTestStep.code + 1);
            }
        });
    });
};

//Gets the test step with the supplied test step code
testStepSchema.statics.getAllTestSteps = function getAllTestSteps(projectCode, testStepArguments) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Create an array to store the test step promises
        var testSteps = [];

        //For each test step argument
        for (var argument of testStepArguments) {

            //Get the test step
            testSteps.push(mongoose.model('TestStep').getTestStep(projectCode, argument.code));
        }

        //If all the promises are successful
        Promise.all(testSteps).then(function(data) {
            
            //Return the test step data
            resolve(data);

        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
};

//Gets the test step with the supplied test step code
testStepSchema.statics.getTestStep = function getTestStep(projectCode, testStepCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the test step
        mongoose.model('TestStep')
            .findOne({code: testStepCode, projectCode: projectCode}, '-_id code projectCode step type')
            .exec(function(error, testStep) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the test step
                resolve(testStep);
            }
        });
    });
};

//Gets all test steps by project code and type, containing the step criteria
testStepSchema.statics.searchForTestStep = function searchForTestStep(projectCode, type, step) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the test steps
        mongoose.model('TestStep')
            .find({projectCode: projectCode, type: type, step: {$regex : step}},
                '-_id code projectCode step type')
            .sort({type: 1, step: 1})
            .exec(function(error, testSteps) {

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

//Updates an existing test step
testStepSchema.statics.updateTestStep = function updateTestStep(newTestStepData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the test step and update it
        mongoose.model('TestStep')
            .findOneAndUpdate({code: newTestStepData.code, projectCode: newTestStepData.projectCode},
                newTestStepData, function(error, testStep) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the test step wasn't found
            else if (!testStep) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Test step not found'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
};

var TestStep = mongoose.model('TestStep', testStepSchema);
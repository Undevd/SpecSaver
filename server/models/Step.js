var mongoose = require('mongoose');

var stepSchema = mongoose.Schema({
    code: {type: Number, required: '{PATH} is required'},
    type: {type: String, required: '{PATH} is required'},
    step: {type: String, required: '{PATH} is required'},
    projectCode: {type:String, required: '{PATH} is required'}
});

stepSchema.index({code: 1, projectCode: 1}, {unique: true});

//Adds a test step to the system test
stepSchema.statics.addStep = function addStep(newStepData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the system test
        var systemTest = mongoose.model('SystemTest')
            .getSystemTestAndSteps(newStepData.projectCode, newStepData.systemTestCode);

        //Check if the test step exists
        var stepExists = mongoose.model('Step')
            .exists(newStepData.projectCode, newStepData.code);

        //If all the promises are successful
        Promise.all([systemTest, stepExists]).then(function(data) {

            //Get the system test data
            var systemTestData = data[0];

            //Record the new data to save
            var newDataToSave = {
                code: newStepData.code,
                arguments: newStepData.arguments
            };

            //If a test step is being edited
            if (newStepData.isEdit) {
                
                //Overwrite the test step data in the required position
                systemTestData.stepArguments[newStepData.position] = newDataToSave;
            }
            else {
                
                //Add the test step to the required position
                systemTestData.stepArguments.splice(newStepData.position, 0, newDataToSave);
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
stepSchema.statics.createStep = function createStep(newStepData) {
    
    //Return the created step
    return create(newStepData);
};

//Imports the supplied backup step by creating it or updating it if it exists
stepSchema.statics.importBackupStep = function importBackupStep(newStepData) {
    
    //Return the created or updated step
    return importStep(newStepData, true);
};

//Checks whether the test step with the supplied code exists
stepSchema.statics.exists = function exists(projectCode, stepCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the number of test steps by code
        mongoose.model('Step')
            .count({code: stepCode, projectCode: projectCode})
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

//Gets the test step with the supplied test step code
stepSchema.statics.getAllSteps = function getAllSteps(projectCode, stepArguments) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Create an array to store the test step promises
        var steps = [];

        //For each test step argument
        for (var argument of stepArguments) {

            //Get the test step
            steps.push(mongoose.model('Step').getStep(projectCode, argument.code));
        }

        //If all the promises are successful
        Promise.all(steps).then(function(data) {
            
            //Return the test step data
            resolve(data);

        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
};

//Gets the test step with the supplied test step code
stepSchema.statics.getStep = function getStep(projectCode, stepCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the test step
        mongoose.model('Step')
            .findOne({code: stepCode, projectCode: projectCode}, '-_id code projectCode step type')
            .exec(function(error, step) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the test step
                resolve(step);
            }
        });
    });
};

//Imports the supplied SpecFlow step by creating it or updating it if it exists
stepSchema.statics.importSpecFlowStep = function importSpecFlowStep(newStepData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //If data was supplied
        if (newStepData) {

            //Create or update the step
            importStep(newStepData, false).then(function(data) {

                //Return the response
                resolve(data);

            }, function(error) {

                //Return an error
                reject(error);
            });
        }
        else {

            //Return an error
            reject({code: 400, errmsg: 'No step data supplied'});
        }
    });
};

//Gets all test steps by project code and type, containing the step criteria
stepSchema.statics.searchForStep = function searchForStep(projectCode, type, step) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the test steps
        mongoose.model('Step')
            .find({projectCode: projectCode, type: type, step: {$regex: new RegExp(step, 'i')}},
                '-_id code projectCode step type')
            .sort({type: 1, step: 1})
            .exec(function(error, steps) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the test steps
                resolve(steps);
            }
        });
    });
};

//Updates an existing test step
stepSchema.statics.updateStep = function updateStep(newStepData) {
    
    //Return the updated step
    return update(newStepData);
};

//Helper method used to create a new step
function create(newStepData) {

    //Sanitise the data
    newStepData = sanitise(newStepData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Check if the project exists
        var projectExists = mongoose.model('Project').exists(newStepData.projectCode);

        //Get the next available step code
        var stepCode = getNextCode(newStepData.projectCode);

        //If all the promises are successful
        Promise.all([projectExists, stepCode]).then(function(data) {

            //Set the step code
            newStepData.code = data[1];

            //Create the test step
            mongoose.model('Step').create(newStepData, function(error, step) {

                //If an error occurred
                if (error) {

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
                    resolve({code: step.code, projectCode: step.projectCode});
                }
            });
        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
}

//Gets the next unassigned code for a new test step
function getNextCode(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the project and increment the last step code assigned by 1
        mongoose.model('Project').findOneAndUpdate({code: projectCode},
            {$inc: {lastStepCode: 1}}, {new: true}, function(error, project) {
              
                //If an error occurred
                if (error) {

                    //Return the error
                    reject(error);
                }
                else {

                    //Return the next available code
                    resolve(project.lastStepCode);
                }
            });

    });
}

//Helper method used to import a step by creating it a or updating it if it exists
function importStep(newStepData, stepCodeRequired) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //If no step data or codes were supplied
        if (!newStepData || (stepCodeRequired && !newStepData.code) || !newStepData.projectCode) {

            //Return an error
            reject({code: 400, errmsg: 'Invalid step'});
        }
        else {

            //If a step code has been specified
            if (newStepData.code) {

                //Find the number of steps by code
                mongoose.model('Step')
                    .count({
                        code: newStepData.code,
                        projectCode: newStepData.projectCode
                    })
                    .exec(function(error, count) {

                    //If an error occurred
                    if (error) {

                        //Return the error
                        reject(error);
                    }
                    //Else if the step couldn't be found
                    else if (!count) {

                        //Create it
                        create(newStepData).then(function(stepCode) {

                            //Return the result
                            resolve(stepCode);

                        }, function(error) {

                            //Return the error
                            reject(error);
                        });
                    }
                    //Else if multiple steps were found
                    else if (count > 1) {

                        //Return a 400 error
                        reject({code: 400, errmsg: 'Multiple steps found with the same code'});
                    }
                    else {

                        //Update it
                        update(newStepData).then(function(stepCode) {

                            //Return the result
                            resolve(stepCode);

                        }, function(error) {

                            //Return the error
                            reject(error);
                        });
                    }
                });
            }
            else {

                //Search for a matching step
                mongoose.model('Step')
                    .find({
                        projectCode: newStepData.projectCode,
                        type: newStepData.type,
                        step: newStepData.step
                    }, '-_id code')
                    .exec(function(error, steps) {
                    
                    //If an error occurred
                    if (error) {

                        //Return the error
                        reject(error);
                    }
                    //Else if an exact match was found
                    else if (steps.length == 1) {

                        //Return the step code
                        resolve(steps[0].code);
                    }
                    //Else if more than one match was found
                    else if (steps.length > 1) {

                        //Return an error
                        reject({
                            code: 400,
                            errmsg: 'Expected 1 match. Actual: ' + steps.length
                        });
                    }
                    else {

                        //Create it
                        create(newStepData).then(function(stepCode) {

                            //Return the result
                            resolve(stepCode);

                        }, function(error) {

                            //Return the error
                            reject(error);
                        });
                    }
                });
            }
        }
    });
}

//Sanitises the supplied step data and returns only the relevant content
function sanitise(stepData) {

    //Return the sanitised step data
    return {
        code: stepData.code,
        type: stepData.type,
        step: stepData.step,
        projectCode: stepData.projectCode
    };
}

//Helper method used to update an existing step
function update(newStepData) {

    //Sanitise the data
    newStepData = sanitise(newStepData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the step and update it
        mongoose.model('Step')
            .findOneAndUpdate({code: newStepData.code, projectCode: newStepData.projectCode},
                {$set: newStepData}, function(error, step) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the step wasn't found
            else if (!step) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Step not found'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
}

var Step = mongoose.model('Step', stepSchema);
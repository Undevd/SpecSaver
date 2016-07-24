var mongoose = require('mongoose');

var systemTestSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    description: {type: String},
    projectCode: {type: String, required: '{PATH} is required'},
    featureCodes: {type: [String]},
    acceptanceTestCodes : {
        type: Array,
        code: {type: Number},
        featureCode: {type: String}
    },
    stepArguments: {
        type: Array,
        code: {type: Number},
        arguments: {
            type: Array,
            name: {type: String},
            value: {type: String}
        }
    }
});

systemTestSchema.index({code: 1, projectCode: 1}, {unique: true});

//Creates a new system test
systemTestSchema.statics.createSystemTest = function createSystemTest(newSystemTestData) {
    
    //Return the created system test
    return create(newSystemTestData);
};

//Creates or update an existing system test if it exists
systemTestSchema.statics.createOrUpdateSystemTest = function createOrUpdateSystemTest(newSystemTestData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //If no system test data or codes were supplied
        if (!newSystemTestData || !newSystemTestData.code || !newSystemTestData.projectCode) {

            //Return an error
            reject({code: 400, errmsg: 'Invalid system test'});
        }
        else {

            //Find the number of system tests by code
            mongoose.model('SystemTest')
                .count({
                    code: newSystemTestData.code,
                    projectCode: newSystemTestData.projectCode
                })
                .exec(function(error, count) {

                //If an error occurred
                if (error) {

                    //Return the error
                    reject(error);
                }
                //Else if the system test couldn't be found
                else if (!count) {

                    //Create it
                    create(newSystemTestData).then(function(systemTestCode) {

                        //Return the result
                        resolve(systemTestCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
                //Else if multiple system tests were found
                else if (count > 1) {

                    //Return a 400 error
                    reject({code: 400, errmsg: 'Multiple system tests found with the same code'});
                }
                else {

                    //Update it
                    update(newSystemTestData).then(function(systemTestCode) {

                        //Return the result
                        resolve(systemTestCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
            });
        }
    });
};

//Checks whether the system test with the supplied code exists
systemTestSchema.statics.exists = function exists(projectCode, systemTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the number of system tests by code
        mongoose.model('SystemTest')
            .count({code: systemTestCode, projectCode: projectCode})
            .exec(function(error, count) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the system test couldn't be found
            else if (!count) {

                //Return a 404 error
                reject({code: 404, errmsg: 'System test not found'});
            }
            //Else if multiple system tests were found
            else if (count > 1) {

                //Return a 400 error
                reject({code: 400, errmsg: 'Multiple system tests found with the same code'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
};

//Gets all system tests by project and acceptance test code
systemTestSchema.statics.getAllSystemTestsByAcceptanceTest = function getAllSystemTestsByAcceptanceTest(projectCode, featureCode, acceptanceTestCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the system tests by project code
        mongoose.model('SystemTest')
            .find({
                projectCode: projectCode,
                acceptanceTestCodes: {
                    $elemMatch: {
                        code: parseInt(acceptanceTestCode),
                        featureCode: featureCode
                    }
                }
            }, '-_id code projectCode')
            .sort('code')
            .exec(function(error, systemTests) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the system tests
                resolve(systemTests);
            }
        });
    });
};

//Gets all system tests by project code
systemTestSchema.statics.getAllSystemTestsByProject = function getAllSystemTestsByProject(projectCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the system tests by project code
        mongoose.model('SystemTest')
            .find({projectCode: projectCode}, '-_id code description name')
            .sort('name')
            .exec(function(error, systemTests) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the system tests
                resolve(systemTests);
            }
        });
    });
};

//Gets the system test with the supplied system test code
systemTestSchema.statics.getSystemTest = function getSystemTest(projectCode, systemTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the systemTest
        mongoose.model('SystemTest')
            .findOne({code: systemTestCode, projectCode: projectCode},
                '-_id acceptanceTestCodes code description featureCodes name projectCode')
            .exec(function(error, systemTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the system test
                resolve(systemTest);
            }
        });
    });
};

//Gets the system test with the supplied system test code and the associated test step codes and arguments
systemTestSchema.statics.getSystemTestAndSteps = function getSystemTest(projectCode, systemTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the systemTest
        mongoose.model('SystemTest')
            .findOne({code: systemTestCode, projectCode: projectCode},
                '-_id acceptanceTestCodes code description featureCodes name projectCode stepArguments')
            .exec(function(error, systemTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the system test
                resolve(systemTest);
            }
        });
    });
};

//Gets the system test with the supplied system test code and the associated features and test steps in full
systemTestSchema.statics.getSystemTestExpanded = function getSystemTestExpanded(projectCode, systemTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the system test
        mongoose.model('SystemTest')
            .findOne({code: systemTestCode, projectCode: projectCode},
                '-_id acceptanceTestCodes code description featureCodes name projectCode stepArguments')
            .exec(function(error, systemTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Get the acceptance tests associated with the system test
                var acceptanceTests = mongoose.model('AcceptanceTest').getAllAcceptanceTests(projectCode, systemTest.acceptanceTestCodes);

                //Get the features associated with the system test
                var features = mongoose.model('Feature').getAllFeatures(projectCode, systemTest.featureCodes);

                //Get the test steps associated with the system test
                var steps = mongoose.model('Step').getAllSteps(projectCode, systemTest.stepArguments);

                //If all the promises are successful
                Promise.all([acceptanceTests, features, steps]).then(function(data) {
                    
                    //Return the system test and test steps
                    resolve({
                        acceptanceTests: data[0],
                        features: data[1],
                        systemTest: systemTest,
                        steps: data[2]
                    });

                }, function(error) {
                    
                    //Otherwise return the error
                    reject(error);
                });
            }
        });
    });
};

//Gets the next unassigned code for a new system test
systemTestSchema.statics.getNextCode = function getNextCode(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the latest system test
        mongoose.model('SystemTest')
            .findOne({projectCode: projectCode})
            .sort('-code')
            .exec(function(error, latestSystemTest) {
            
            //If an error occurred
            if(error) {

                //Return the error
                reject(error);
            }
            else {

                //Return a new code for the system test, starting from 1 if none exists
                resolve(latestSystemTest == null? 1 : latestSystemTest.code + 1);
            }
        });
    });
};

//Gets overall statistics for system tests associated with the project
systemTestSchema.statics.getSystemTestStatsForProject = function getSystemTestStatsForProject(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {
        
        //Count the number of system tests associated with the project
        var projectCount = mongoose.model('SystemTest')
            .count({projectCode: projectCode})
            .exec();

        //If all the promises are successful
        Promise.all([projectCount]).then(function(data) {

            //Return the statistics
            resolve({total: data[0]});

        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
};

//Updates an existing system test
systemTestSchema.statics.updateSystemTest = function updateSystemTest(newSystemTestData) {
    
    //Return the updated system test
    return update(newSystemTestData);
};

//Helper method used to create a new system test
function create(newSystemTestData) {

    //Sanitise the data
    newSystemTestData = sanitise(newSystemTestData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Check if the project exists
        var projectExists = mongoose.model('Project').exists(newSystemTestData.projectCode);

        //Find the newest system test
        var systemTestCode = mongoose.model('SystemTest').getNextCode(newSystemTestData.projectCode);

        //If all the promises are successful
        Promise.all([projectExists, systemTestCode]).then(function(data) {
            
            //Set the system test code
            newSystemTestData.code = data[1];

            //Create the system test
            mongoose.model('SystemTest').create(newSystemTestData, function(error, systemTest) {

                //If an error occurred
                if(error) {

                    //If the error code was 11000
                    if (error.code == 11000) {

                        //Update the error message to be more user friendly
                        error.errmsg = 'A system test with the same code already exists.';
                    }

                    //Return the error
                    reject(error);
                }
                else {

                    //Otherwise, return the system test and project code
                    resolve({code: systemTest.code, projectCode: systemTest.projectCode});
                }
            });
        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
}

//Sanitises the supplied system test data and returns only the relevant content
function sanitise(systemTestData) {

    //Sanitise the data
    var newSystemTestData = {
        name: systemTestData.name,
        code: systemTestData.code,
        description: systemTestData.description,
        projectCode: systemTestData.projectCode,
        featureCodes: [],
        acceptanceTestCodes: [],
        stepArguments: []
    };

    //For each feature code
    for (var featureCode of systemTestData.featureCodes) {
        
        //If the value is a string or a number
        //and it isn't already in the list
        if ((typeof featureCode === "string" || typeof featureCode === "number")
            && newSystemTestData.featureCodes.indexOf(featureCode) < 0) {

            //Add the value to the updated system test
            newSystemTestData.featureCodes.push(featureCode);
        }
    }

    //For each acceptance test
    for (var acceptanceTest of systemTestData.acceptanceTestCodes) {
        
        //If the code is a number
        //and the feature code is a string or a number
        //and it isn't already in the list
        if (typeof acceptanceTest.code === "number"
            && (typeof acceptanceTest.featureCode === "string"
                || typeof acceptanceTest.featureCode === "number")
            && newSystemTestData.acceptanceTestCodes.map(function(e) {
                return e.featureCode + ',' + e.code
            }).indexOf(acceptanceTest.featureCode + ',' + acceptanceTest.code) < 0) {

            //Add the values to the updated system test
            newSystemTestData.acceptanceTestCodes.push({
                code: acceptanceTest.code,
                featureCode: acceptanceTest.featureCode
            });
        }
    }

    //For each test step
    for (var step of systemTestData.stepArguments) {
        
        //Create a new object to store the sanitised arguments
        var stepArguments = {
            code: step.code,
            arguments: []
        }; 
   
        //If there are arguments defined
        if (step.arguments) {
            
            //For each argument
            for (var argument of step.arguments) {
                
                //Add a sanitised version of the argument to the new object
                stepArguments.arguments.push({name: argument.name, value: argument.value});
            }
        }
        
        //Add the object to the updated system test
        newSystemTestData.stepArguments.push(stepArguments);
    }

    //Return the sanitised system test data
    return newSystemTestData;
}

//Helper method used to update an existing system test
function update(newSystemTestData) {

    //Sanitise the data
    newSystemTestData = sanitise(newSystemTestData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the system test and update it
        mongoose.model('SystemTest')
            .findOneAndUpdate({code: newSystemTestData.code, projectCode: newSystemTestData.projectCode},
                newSystemTestData, function(error, systemTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the system test wasn't found
            else if (!systemTest) {

                //Return a 404 error
                reject({code: 404, errmsg: 'System test not found'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
}

var SystemTest = mongoose.model('SystemTest', systemTestSchema);
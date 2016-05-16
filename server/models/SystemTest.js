var mongoose = require('mongoose');

var systemTestSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    description: {type: String},
    projectCode: {type: String, required: '{PATH} is required'},
    testStepArguments: {
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
};

//Checks whether the system test with the supplied code exists
systemTestSchema.statics.exists = function exists(projectCode, systemTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the number of system tests by code
        mongoose.model('SystemTest').count({code: systemTestCode, projectCode: projectCode}).exec(function(error, count) {

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

//Gets all system tests by project code
systemTestSchema.statics.getAllSystemTestsByProject = function getAllSystemTestsByProject(projectCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the system tests by project code
        mongoose.model('SystemTest').find({projectCode: projectCode}, '-_id code description name').sort('name').exec(function(error, systemTests) {

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
        mongoose.model('SystemTest').findOne({code: systemTestCode, projectCode: projectCode}, '-_id code description name projectCode').exec(function(error, systemTest) {

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
systemTestSchema.statics.getSystemTestAndTestSteps = function getSystemTest(projectCode, systemTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the systemTest
        mongoose.model('SystemTest').findOne({code: systemTestCode, projectCode: projectCode}, '-_id code description name projectCode testStepArguments').exec(function(error, systemTest) {

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

//Gets the system test with the supplied system test code and the associated test steps in full
systemTestSchema.statics.getSystemTestAndTestStepsExpanded = function getSystemTestAndTestStepsExpanded(projectCode, systemTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the systemTest
        mongoose.model('SystemTest').findOne({code: systemTestCode, projectCode: projectCode}, '-_id code description name projectCode testStepArguments').exec(function(error, systemTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Get the test steps associated with the system test
                mongoose.model('TestStep').getAllTestSteps(projectCode, systemTest.testStepArguments).then(function(data) {

                    //Return the system test and test steps
                    resolve({systemTest: systemTest, testSteps: data});

                }, function(error) {

                    //Return the error
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
        mongoose.model('SystemTest').findOne({projectCode: projectCode}).sort('-code').exec(function(error, latestSystemTest) {
            
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
        var projectCount = mongoose.model('SystemTest').count({projectCode: projectCode}).exec();

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
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the system test and update it
        mongoose.model('SystemTest').findOneAndUpdate({code: newSystemTestData.code, projectCode: newSystemTestData.projectCode}, newSystemTestData, function(error, systemTest) {

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
};

var SystemTest = mongoose.model('SystemTest', systemTestSchema);
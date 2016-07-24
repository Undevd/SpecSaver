var mongoose = require('mongoose');

var acceptanceTestSchema = mongoose.Schema({
    given: {type: String, required: '{PATH} is required'},
    when: {type: String, required: '{PATH} is required'},
    then: {type: String, required: '{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    projectCode: {type: String, required: '{PATH} is required'},
    featureCode: {type: String, required: '{PATH} is required'},
    userStoryCodes: {type: [String]}
});

acceptanceTestSchema.index({code: 1, projectCode: 1, featureCode: 1}, {unique: true});

//Creates a new acceptance test
acceptanceTestSchema.statics.createAcceptanceTest = function createAcceptanceTest(newAcceptanceTestData) {
    
    //Return the created acceptance test
    return create(newAcceptanceTestData);
};

//Creates or update an existing acceptance test if it exists
acceptanceTestSchema.statics.createOrUpdateAcceptanceTest = function createOrUpdateAcceptanceTest(newAcceptanceTestData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //If no acceptance test data or codes were supplied
        if (!newAcceptanceTestData || !newAcceptanceTestData.code || !newAcceptanceTestData.projectCode
            || !newAcceptanceTestData.featureCode) {

            //Return an error
            reject({code: 400, errmsg: 'Invalid acceptance test'});
        }
        else {

            //Find the number of acceptance tests by code
            mongoose.model('AcceptanceTest')
                .count({
                    code: newAcceptanceTestData.code,
                    projectCode: newAcceptanceTestData.projectCode,
                    featureCode: newAcceptanceTestData.featureCode
                })
                .exec(function(error, count) {

                //If an error occurred
                if (error) {

                    //Return the error
                    reject(error);
                }
                //Else if the acceptance test couldn't be found
                else if (!count) {

                    //Create it
                    create(newAcceptanceTestData).then(function(acceptanceTestCode) {

                        //Return the result
                        resolve(acceptanceTestCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
                //Else if multiple acceptance tests were found
                else if (count > 1) {

                    //Return a 400 error
                    reject({code: 400, errmsg: 'Multiple acceptance tests found with the same code'});
                }
                else {

                    //Update it
                    update(newAcceptanceTestData).then(function(acceptanceTestCode) {

                        //Return the result
                        resolve(acceptanceTestCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
            });
        }
    });
};

//Gets the acceptance test with the supplied acceptance test code
acceptanceTestSchema.statics.getAcceptanceTest = function getAcceptanceTest(projectCode, featureCode, acceptanceTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the acceptance test
        mongoose.model('AcceptanceTest')
            .findOne({code: acceptanceTestCode, projectCode: projectCode, featureCode: featureCode},
                '-_id code featureCode given projectCode then when')
            .exec(function(error, acceptanceTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the acceptance test
                resolve(acceptanceTest);
            }
        });
    });
};

//Gets the acceptance test expanded with the supplied acceptance test code
acceptanceTestSchema.statics.getAcceptanceTestExpanded = function getAcceptanceTestExpanded(projectCode, featureCode, acceptanceTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the acceptance test
        mongoose.model('AcceptanceTest')
            .findOne({code: acceptanceTestCode, projectCode: projectCode, featureCode: featureCode},
                '-_id code featureCode given projectCode then userStoryCodes when')
            .exec(function(error, acceptanceTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Get the user stories associated with the acceptance test
                var userStories = mongoose.model('UserStory').getAllUserStories(projectCode, featureCode, acceptanceTest.userStoryCodes);

                //If all the promises are successful
                Promise.all([userStories]).then(function(data) {
                    
                    //Return the acceptance test and user stories
                    resolve({
                        acceptanceTest: acceptanceTest,
                        userStories: data[0]
                    });

                }, function(error) {
                    
                    //Otherwise return the error
                    reject(error);
                });
            }
        });
    });
};

//Gets overall statistics for acceptance test associated with the feature
acceptanceTestSchema.statics.getAcceptanceTestStatsForFeature = function getAcceptanceTestStatsForFeature(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {
        
        //Count the number of acceptance tests associated with the feature
        var featureCount = mongoose.model('AcceptanceTest')
            .count({projectCode: projectCode, featureCode: featureCode})
            .exec();

        //If all the promises are successful
        Promise.all([featureCount]).then(function(data) {

            //Return the statistics
            resolve({total: data[0]});

        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
};

//Gets overall statistics for acceptance tests associated with the project
acceptanceTestSchema.statics.getAcceptanceTestStatsForProject = function getAcceptanceTestStatsForProject(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {
        
        //Count the number of acceptance tests associated with the project
        var projectCount = mongoose.model('AcceptanceTest')
            .count({projectCode: projectCode})
            .exec();

        //Get all of the feature codes in the project
        var featureCodes = mongoose.model('Feature')
            .find({projectCode: projectCode}, 'code')
            .sort('code')
            .exec();

        //Aggregate the number of acceptance tests associated with the features in the project
        var featureCount = mongoose.model('AcceptanceTest')
            .aggregate([{$match: {projectCode: projectCode}}, {$group: {_id: "$featureCode", total: {$sum: 1}}}])
            .sort('_id')
            .exec();

        //If all the promises are successful
        Promise.all([projectCount, featureCodes, featureCount]).then(function(data) {

            //Build the feature stats array
            var featureStats = [];

            //For each feature
            for (var feature of data[1]) {

                //Get its acceptance test total
                var total = 0;
                
                //For each count
                for (var count of data[2]) {

                    //If the ID matches the current feature code
                    if (count._id == feature.code) {
                        
                        //Record the total
                        total = count.total;
                    }
                }

                //Push the total onto the array
                featureStats.push({code: feature.code, total: total});
            }

            //Return the statistics
            resolve({total: data[0], feature: featureStats});

        }, function(error) {
            
            //Return the error
            reject(error);
        });
    });
};

//Gets all acceptance tests with the supplied project, feature, and acceptance test codes
acceptanceTestSchema.statics.getAllAcceptanceTests = function getAllAcceptanceTests(projectCode, acceptanceTestCodes) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //If no acceptance test codes were supplied
        if (!acceptanceTestCodes.length) {
            
            //Resolve the promise with an empty array
            resolve([]);

            return;
        }

        //Find the acceptance tests by feature code
        mongoose.model('AcceptanceTest')
            .find({
                $and: [
                    {projectCode: projectCode},
                    {$or: acceptanceTestCodes}
                ]
            }, '-_id code featureCode given projectCode then when')
            .sort('name')
            .exec(function(error, acceptanceTests) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the acceptance tests
                resolve(acceptanceTests);
            }
        });
    });
};

//Gets all acceptance tests by feature code
acceptanceTestSchema.statics.getAllAcceptanceTestsByFeature = function getAllAcceptanceTestsByFeature(projectCode, featureCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the acceptance tests by feature code
        mongoose.model('AcceptanceTest')
            .find({projectCode: projectCode, featureCode: featureCode}, '-_id code given then when')
            .sort('name')
            .exec(function(error, acceptanceTests) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the acceptance tests
                resolve(acceptanceTests);
            }
        });
    });
};

//Gets the next unassigned code for a new acceptance test
acceptanceTestSchema.statics.getNextCode = function getNextCode(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

    	//Find the latest acceptance test
		mongoose.model('AcceptanceTest')
            .findOne({projectCode: projectCode, featureCode: featureCode})
            .sort('-code')
            .exec(function(error, latestAcceptanceTest) {
	        
            //If an error occurred
            if(error) {

                //Return the error
                reject(error);
            }
            else {

                //Return a new code for the acceptance test, starting from 1 if none exists
                resolve(latestAcceptanceTest == null? 1 : latestAcceptanceTest.code + 1);
            }
        });
    });
};

//Gets all acceptance tests by project code containing the name / code criteria
acceptanceTestSchema.statics.searchForAcceptanceTest = function searchForAcceptanceTest(projectCode, criteria) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Determine the code criteria to use
        //If it isn't a number, use a code which is not in use (-1)
        //Otherwise, use the value supplied
        var codeCriteria = isNaN(criteria) ? -1 : criteria;

        //Find the acceptance tests
        mongoose.model('AcceptanceTest')
            .find({
                $and: [
                    {projectCode: projectCode},
                    {
                        $or: [
                            {code: codeCriteria},
                            {featureCode: {$regex: new RegExp(criteria, 'i')}},
                            {given: {$regex: new RegExp(criteria, 'i')}},
                            {when: {$regex: new RegExp(criteria, 'i')}},
                            {then: {$regex: new RegExp(criteria, 'i')}}
                        ]
                    }
                ]
            }, '-_id code featureCode given projectCode then when')
            .sort({projectCode: 1, featureCode: 1, code: 1})
            .exec(function(error, acceptanceTests) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the acceptance tests
                resolve(acceptanceTests);
            }
        });
    });
};

//Updates an existing acceptance test
acceptanceTestSchema.statics.updateAcceptanceTest = function updateAcceptanceTest(newAcceptanceTestData) {
    
    //Return the updated acceptance test
    return update(newAcceptanceTestData);
};

//Helper method used to create a new acceptance test
function create(newAcceptanceTestData) {

    //Sanitise the data
    newAcceptanceTestData = sanitise(newAcceptanceTestData);

    //Return a promise
    return new Promise(function(resolve, reject) {

	    //Check if the project exists
	    var projectExists = mongoose.model('Project')
            .exists(newAcceptanceTestData.projectCode);

	    //Check if the feature exists
	    var featureExists = mongoose.model('Feature')
            .exists(newAcceptanceTestData.projectCode, newAcceptanceTestData.featureCode);

	    //Find the newest acceptance test
	    var acceptanceTestCode = mongoose.model('AcceptanceTest')
            .getNextCode(newAcceptanceTestData.projectCode, newAcceptanceTestData.featureCode);

	    //If all the promises are successful
	    Promise.all([projectExists, featureExists, acceptanceTestCode]).then(function(data) {
	        
	    	//Set the acceptance test code
	    	newAcceptanceTestData.code = data[2];

	      	//Create the acceptance test
	    	mongoose.model('AcceptanceTest').create(newAcceptanceTestData, function(error, acceptanceTest) {

		        //If an error occurred
		        if(error) {

		            //If the error code was 11000
		            if (error.code == 11000) {

		                //Update the error message to be more user friendly
		                error.errmsg = 'An acceptance test with the same code already exists.';
		            }

		            //Return the error
		            reject(error);
		        }
		        else {

		            //Otherwise, return the acceptance test, project, and feature code
		            resolve({
                        code: acceptanceTest.code,
                        projectCode: acceptanceTest.projectCode,
                        featureCode: acceptanceTest.featureCode
                    });
		        }
		    });
	    }, function(error) {
	        
	        //Return the error
	        reject(error);
	    });
    });
}

//Sanitises the supplied acceptance test data and returns only the relevant content
function sanitise(acceptanceTestData) {

    //Sanitise the data
    var newAcceptanceTestData = {
        code: acceptanceTestData.code,
        given: acceptanceTestData.given,
        when: acceptanceTestData.when,
        then: acceptanceTestData.then,
        projectCode: acceptanceTestData.projectCode,
        featureCode: acceptanceTestData.featureCode,
        userStoryCodes: []
    };

    //For each user story code
    for (var userStoryCode of acceptanceTestData.userStoryCodes) {
        
        //If the value is a number and it isn't already in the list
        if (typeof userStoryCode === "number"
            && newAcceptanceTestData.userStoryCodes.indexOf(userStoryCode) < 0) {

            //Add the value to the updated acceptance test
            newAcceptanceTestData.userStoryCodes.push(userStoryCode);
        }
    }

    //Return the sanitised acceptance test data
    return newAcceptanceTestData;
}

//Helper method used to update an existing acceptance test
function update(newAcceptanceTestData) {

    //Sanitise the data
    newAcceptanceTestData = sanitise(newAcceptanceTestData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the acceptance test and update it
        mongoose.model('AcceptanceTest')
            .findOneAndUpdate({code: newAcceptanceTestData.code, projectCode: newAcceptanceTestData.projectCode,
                featureCode: newAcceptanceTestData.featureCode}, newAcceptanceTestData, function(error, acceptanceTest) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the acceptance test wasn't found
            else if (!acceptanceTest) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Acceptance Test not found'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
}

var AcceptanceTest = mongoose.model('AcceptanceTest', acceptanceTestSchema);
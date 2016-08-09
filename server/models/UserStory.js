var mongoose = require('mongoose');

var userStorySchema = mongoose.Schema({
    asA: {type:String, required:'{PATH} is required'},
    iWant: {type:String, required:'{PATH} is required'},
    soThat: {type:String, required:'{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    projectCode: {type:String, required: '{PATH} is required'},
    featureCode: {type:String, required: '{PATH} is required'}
});

userStorySchema.index({code: 1, projectCode: 1, featureCode: 1}, {unique: true});

//Creates a new user story
userStorySchema.statics.createUserStory = function createUserStory(newUserStoryData) {
    
    //Return the created user story
    return create(newUserStoryData);
};

//Creates or update an existing user story if it exists
userStorySchema.statics.createOrUpdateUserStory = function createOrUpdateUserStory(newUserStoryData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //If no user story data or codes were supplied
        if (!newUserStoryData || !newUserStoryData.code || !newUserStoryData.projectCode
            || !newUserStoryData.featureCode) {

            //Return an error
            reject({code: 400, errmsg: 'Invalid user story'});
        }
        else {

            //Find the number of user stories by code
            mongoose.model('UserStory')
                .count({
                    code: newUserStoryData.code,
                    projectCode: newUserStoryData.projectCode,
                    featureCode: newUserStoryData.featureCode
                })
                .exec(function(error, count) {

                //If an error occurred
                if (error) {

                    //Return the error
                    reject(error);
                }
                //Else if the user story couldn't be found
                else if (!count) {

                    //Create it
                    create(newUserStoryData).then(function(userStoryCode) {

                        //Return the result
                        resolve(userStoryCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
                //Else if multiple user stories were found
                else if (count > 1) {

                    //Return a 400 error
                    reject({code: 400, errmsg: 'Multiple user stories found with the same code'});
                }
                else {

                    //Update it
                    update(newUserStoryData).then(function(userStoryCode) {

                        //Return the result
                        resolve(userStoryCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
            });
        }
    });
};

//Gets all of the user stories with the supplied user story codes
userStorySchema.statics.getAllUserStories = function getAllUserStories(projectCode, featureCode, userStoryCodes) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Create an array of promises
        var userStories = [];

        //For each user story code
        for (var userStoryCode of userStoryCodes) {

            //Add a new promise to the array
            userStories.push(mongoose.model('UserStory').getUserStory(projectCode, featureCode, userStoryCode));
        }

        //If all the promises are successful
        Promise.all(userStories).then(function(data) {
            
            //If at least one result was found
            if (data.length) {

                //Sort the results
                data.sort(function(a, b) {
                    return a.asA && b.asA ? (a.asA > b.asA) - (a.asA < b.asA) : 0; 
                });
            }

            //Resolve the promise
            resolve(data);

        }, function(error) {
            
            //Otherwise return the error
            reject(error);
        });
    });
};

//Gets all user stories by feature code
userStorySchema.statics.getAllUserStoriesByFeature = function getAllUserStoriesByFeature(projectCode, featureCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the user stories by feature code
        mongoose.model('UserStory')
            .find({projectCode: projectCode, featureCode: featureCode}, '-_id code asA iWant soThat')
            .sort('name')
            .exec(function(error, userStories) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the user stories
                resolve(userStories);
            }
        });
    });
};

//Gets the next unassigned code for a new user story
userStorySchema.statics.getNextCode = function getNextCode(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

    	//Find the latest user story
		mongoose.model('UserStory')
            .findOne({projectCode: projectCode, featureCode: featureCode})
            .sort('-code')
            .exec(function(error, latestUserStory) {
	        
            //If an error occurred
            if(error) {

                //Return the error
                reject(error);
            }
            else {

		        //Return a new code for the user story, starting from 1 if none exists
		        resolve(latestUserStory == null? 1 : latestUserStory.code + 1);
	    	}
	  	});
    });
};

//Gets the user story with the supplied user story code
userStorySchema.statics.getUserStory = function getUserStory(projectCode, featureCode, userStoryCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the user story
        mongoose.model('UserStory')
            .findOne({code: userStoryCode, projectCode: projectCode, featureCode: featureCode},
                '-_id asA code featureCode iWant projectCode soThat')
            .exec(function(error, userStory) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the user story
                resolve(userStory);
            }
        });
    });
};

//Gets overall statistics for user stories associated with the feature
userStorySchema.statics.getUserStoryStatsForFeature = function getUserStoryStatsForFeature(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {
        
        //Count the number of user stories associated with the feature
        var featureCount = mongoose.model('UserStory')
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

//Gets overall statistics for user stories associated with the project
userStorySchema.statics.getUserStoryStatsForProject = function getUserStoryStatsForProject(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {
        
        //Count the number of user stories associated with the project
        var projectCount = mongoose.model('UserStory')
            .count({projectCode: projectCode})
            .exec();

        //Get all of the feature codes in the project
        var featureCodes = mongoose.model('Feature')
            .find({projectCode: projectCode}, 'code')
            .sort('code')
            .exec();

        //Aggregate the number of user stories associated with the features in the project
        var featureCount = mongoose.model('UserStory')
            .aggregate([{$match: {projectCode: projectCode}},
                {$group: {_id: "$featureCode", total: {$sum: 1}}}])
            .sort('_id')
            .exec();

        //If all the promises are successful
        Promise.all([projectCount, featureCodes, featureCount]).then(function(data) {

            //Build the feature stats array
            var featureStats = [];

            //For each feature
            for (var feature of data[1]) {

                //Get its user story total
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

//Gets all user stories by project and feature code containing the name / code criteria
userStorySchema.statics.searchForUserStory = function searchForUserStory(projectCode, featureCode, criteria) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Determine the code criteria to use
        //If it isn't a number, use a code which is not in use (-1)
        //Otherwise, use the value supplied
        var codeCriteria = isNaN(criteria) ? -1 : criteria;

        //Find the user stories
        mongoose.model('UserStory')
            .find({
                $and: [
                    {projectCode: projectCode},
                    {featureCode: featureCode},
                    {
                        $or: [
                            {code: codeCriteria},
                            {asA: {$regex: new RegExp(criteria, 'i')}},
                            {iWant: {$regex: new RegExp(criteria, 'i')}},
                            {soThat: {$regex: new RegExp(criteria, 'i')}}
                        ]
                    }
                ]
            }, '-_id asA code featureCode iWant projectCode soThat')
            .sort({projectCode: 1, featureCode: 1, code: 1})
            .exec(function(error, userStories) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the user stories
                resolve(userStories);
            }
        });
    });
};

//Updates an existing user story
userStorySchema.statics.updateUserStory = function updateUserStory(newUserStoryData) {
    
    //Return the updated user story
    return update(newUserStoryData);
};

//Helper method used to create a new user story
function create(newUserStoryData) {

    //Sanitise the data
    newUserStoryData = sanitise(newUserStoryData);

    //Return a promise
    return new Promise(function(resolve, reject) {

	    //Check if the project exists
	    var projectExists = mongoose.model('Project')
            .exists(newUserStoryData.projectCode);

	    //Check if the feature exists
	    var featureExists = mongoose.model('Feature')
            .exists(newUserStoryData.projectCode, newUserStoryData.featureCode);

	    //Find the next available user story code if one was not supplied
	    var userStoryCode = (newUserStoryData.code)
            ? newUserStoryData.code
            : mongoose.model('UserStory').getNextCode(newUserStoryData.projectCode, newUserStoryData.featureCode);

	    //If all the promises are successful
	    Promise.all([projectExists, featureExists, userStoryCode]).then(function(data) {
	        
	    	//Set the user story code
	    	newUserStoryData.code = data[2];

	      	//Create the user story
	    	mongoose.model('UserStory').create(newUserStoryData, function(error, userStory) {

		        //If an error occurred
		        if(error) {

		            //If the error code was 11000
		            if (error.code == 11000) {

		                //Update the error message to be more user friendly
		                error.errmsg = 'A user story with the same code already exists.';
		            }

		            //Return the error
		            reject(error);
		        }
		        else {

		            //Otherwise, return the user story, project, and feature code
		            resolve({
                        code: userStory.code,
                        projectCode: userStory.projectCode,
                        featureCode: userStory.featureCode
                    });
		        }
		    });
	    }, function(error) {
	        
	        //Return the error
	        reject(error);
	    });
    });
}

//Sanitises the supplied user story data and returns only the relevant content
function sanitise(userStoryData) {

    //Return the sanitised user story data
    return {
        asA: userStoryData.asA,
        code: userStoryData.code,
        iWant: userStoryData.iWant,
        soThat: userStoryData.soThat,
        projectCode: userStoryData.projectCode,
        featureCode: userStoryData.featureCode
    };
}

//Helper method used to update an existing user story
function update(newUserStoryData) {

    //Sanitise the data
    newUserStoryData = sanitise(newUserStoryData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the user story and update it
        mongoose.model('UserStory')
            .findOneAndUpdate({code: newUserStoryData.code, projectCode: newUserStoryData.projectCode,
                featureCode: newUserStoryData.featureCode}, newUserStoryData, function(error, userStory) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the user story wasn't found
            else if (!userStory) {

                //Return a 404 error
                reject({code: 404, errmsg: 'User Story not found'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
}

var UserStory = mongoose.model('UserStory', userStorySchema);
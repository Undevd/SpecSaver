var mongoose = require('mongoose');

var userStorySchema = mongoose.Schema({
    asA: {type:String, required:'{PATH} is required'},
    iCan: {type:String, required:'{PATH} is required'},
    soThat: {type:String, required:'{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    projectCode: {type:String, required: '{PATH} is required'},
    featureCode: {type:String, required: '{PATH} is required'}
});

userStorySchema.index({code: 1, projectCode: 1, featureCode: 1}, {unique: true});

//Creates a new user story
userStorySchema.statics.createUserStory = function createUserStory(newUserStoryData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

	    //Check if the project exists
	    var projectExists = mongoose.model('Project').exists(newUserStoryData.projectCode);

	    //Check if the feature exists
	    var featureExists = mongoose.model('Feature').exists(newUserStoryData.projectCode, newUserStoryData.featureCode);

	    //Find the newest user story
	    var userStoryCode = mongoose.model('UserStory').getNextCode(newUserStoryData.projectCode, newUserStoryData.featureCode);

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
		            resolve({code: userStory.code, projectCode: userStory.projectCode, featureCode: userStory.featureCode});
		        }
		    });
	    }, function(error) {
	        
	        //Return the error
	        reject(error);
	    });
    });
};

//Gets all user stories by feature code
userStorySchema.statics.getAllUserStories = function getAllUserStories(projectCode, featureCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the user stories by feature code
        mongoose.model('UserStory').find({projectCode: projectCode, featureCode: featureCode}, '-_id code asA iCan soThat').sort('name').exec(function(error, userStories) {

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
		UserStory.findOne({projectCode: projectCode, featureCode: featureCode}).sort('-code').exec(function(error, latestUserStory) {
	        
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
        mongoose.model('UserStory').findOne({code: userStoryCode, projectCode: projectCode, featureCode: featureCode}, '-_id asA code featureCode iCan projectCode soThat').exec(function(error, userStory) {

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

//Updates an existing user story
userStorySchema.statics.updateUserStory = function updateUserStory(newUserStoryData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the user story and update it
        mongoose.model('UserStory').findOneAndUpdate({code: newUserStoryData.code, projectCode: newUserStoryData.projectCode, featureCode: newUserStoryData.featureCode}, newUserStoryData, function(error, userStory) {

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
};

var UserStory = mongoose.model('UserStory', userStorySchema);
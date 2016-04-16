var mongoose = require('mongoose');

var acceptanceTestSchema = mongoose.Schema({
    given: {type: String, required: '{PATH} is required'},
    when: {type: String, required: '{PATH} is required'},
    then: {type: String, required: '{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    projectCode: {type: String, required: '{PATH} is required'},
    featureCode: {type: String, required: '{PATH} is required'}
});

acceptanceTestSchema.index({code: 1, projectCode: 1, featureCode: 1}, {unique: true});

//Creates a new acceptance test
acceptanceTestSchema.statics.createAcceptanceTest = function createAcceptanceTest(newAcceptanceTestData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

	    //Check if the project exists
	    var projectExists = mongoose.model('Project').exists(newAcceptanceTestData.projectCode);

	    //Check if the feature exists
	    var featureExists = mongoose.model('Feature').exists(newAcceptanceTestData.projectCode, newAcceptanceTestData.featureCode);

	    //Find the newest acceptance test
	    var acceptanceTestCode = mongoose.model('AcceptanceTest').getNextCode(newAcceptanceTestData.projectCode, newAcceptanceTestData.featureCode);

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
		            resolve({code: acceptanceTest.code, projectCode: acceptanceTest.projectCode, featureCode: acceptanceTest.featureCode});
		        }
		    });
	    }, function(error) {
	        
	        //Return the error
	        reject(error);
	    });
    });
};

//Gets the acceptance test with the supplied acceptance test code
acceptanceTestSchema.statics.getAcceptanceTest = function getAcceptanceTest(projectCode, featureCode, acceptanceTestCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the acceptance test
        mongoose.model('AcceptanceTest').findOne({code: acceptanceTestCode, projectCode: projectCode, featureCode: featureCode}, '-_id code featureCode given projectCode then when').exec(function(error, acceptanceTest) {

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

//Gets all acceptance tests by feature code
acceptanceTestSchema.statics.getAllAcceptanceTests = function getAllAcceptanceTests(projectCode, featureCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the acceptance tests by feature code
        mongoose.model('AcceptanceTest').find({projectCode: projectCode, featureCode: featureCode}, '-_id code given then when').sort('name').exec(function(error, acceptanceTests) {

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
		mongoose.model('AcceptanceTest').findOne({projectCode: projectCode, featureCode: featureCode}).sort('-code').exec(function(error, latestAcceptanceTest) {
	        
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

//Updates an existing acceptance test
acceptanceTestSchema.statics.updateAcceptanceTest = function updateAcceptanceTest(newAcceptanceTestData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the acceptance test and update it
        mongoose.model('AcceptanceTest').findOneAndUpdate({code: newAcceptanceTestData.code, projectCode: newAcceptanceTestData.projectCode, featureCode: newAcceptanceTestData.featureCode}, newAcceptanceTestData, function(error, acceptanceTest) {

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
};

var AcceptanceTest = mongoose.model('AcceptanceTest', acceptanceTestSchema);
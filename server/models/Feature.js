var mongoose = require('mongoose');

var featureSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required'},
    code: {type: String, required: '{PATH} is required'},
    description: {type:String},
    projectCode: {type:String, required: '{PATH} is required'},
    lastUserStoryCode: {type: Number, default: 0},
    lastAcceptanceTestCode: {type: Number, default: 0}
});

featureSchema.index({code: 1, projectCode: 1}, {unique: true});

//Creates a new feature
featureSchema.statics.createFeature = function createFeature(newFeatureData) {
    
    //Return the created feature
    return create(newFeatureData);
};

//Creates or update an existing feature if it exists
featureSchema.statics.createOrUpdateFeature = function createOrUpdateFeature(newFeatureData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //If no feature data or codes were supplied
        if (!newFeatureData || !newFeatureData.code || !newFeatureData.projectCode) {

            //Return an error
            reject({code: 400, errmsg: 'Invalid feature'});
        }
        else {

            //Find the number of features by code
            mongoose.model('Feature')
                .count({code: newFeatureData.code, projectCode: newFeatureData.projectCode})
                .exec(function(error, count) {

                //If an error occurred
                if (error) {

                    //Return the error
                    reject(error);
                }
                //Else if the feature couldn't be found
                else if (!count) {

                    //Create it
                    create(newFeatureData).then(function(featureCode) {

                        //Return the result
                        resolve(featureCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
                //Else if multiple features were found
                else if (count > 1) {

                    //Return a 400 error
                    reject({code: 400, errmsg: 'Multiple features found with the same code'});
                }
                else {

                    //Update it
                    update(newFeatureData).then(function(featureCode) {

                        //Return the result
                        resolve(featureCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
            });
        }
    });
};

//Checks whether the feature with the supplied code exists
featureSchema.statics.exists = function exists(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the number of features by code
        mongoose.model('Feature')
            .count({code: featureCode, projectCode: projectCode})
            .exec(function(error, count) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the feature couldn't be found
            else if (!count) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Feature not found'});
            }
            //Else if multiple features were found
            else if (count > 1) {

                //Return a 400 error
                reject({code: 400, errmsg: 'Multiple features found with the same code'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
};

//Gets all of the feature with the supplied feature code
featureSchema.statics.getAllFeatures = function getAllFeatures(projectCode, featureCodes) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Create an array of promises
        var features = [];

        //For each feature code
        for (var featureCode of featureCodes) {

            //Add a new promise to the array
            features.push(mongoose.model('Feature').getFeature(projectCode, featureCode));
        }

        //If all the promises are successful
        Promise.all(features).then(function(data) {
            
            //If at least one result was found
            if (data.length) {

                //Sort the results
                data.sort(function(a, b) {
                    return a.name && b.name ? (a.name > b.name) - (a.name < b.name) : 0; 
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

//Gets all features by project code
featureSchema.statics.getAllFeaturesByProject = function getAllFeaturesByProject(projectCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the features by project code
        mongoose.model('Feature')
            .find({projectCode: projectCode}, '-_id code description name')
            .sort('name')
            .exec(function(error, features) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the features
                resolve(features);
            }
        });
    });
};

//Gets the feature with the supplied feature code
featureSchema.statics.getFeature = function getFeature(projectCode, featureCode) {

    //Return the feature data
    return get(projectCode, featureCode);
};

//Gets the feature with the supplied feature code, along with the project and all related statistics
featureSchema.statics.getFeatureExpanded = function getFeatureExpanded(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Get the project
        var project = mongoose.model('Project').getProject(projectCode);
        
        //Get the feature
        var feature = get(projectCode, featureCode);

        //Get the statistics
        var statistics = stats(projectCode, featureCode);

        //If all the promises are successful
        Promise.all([project, feature, statistics]).then(function(data) {
            
            //Return the feature and statistics
            resolve({
                project: data[0],
                feature: data[1],
                stats: data[2]
            });

        }, function(error) {
            
            //Return the error message
            reject({code: error.code, message: error.errmsg});
        });
    });
};

//Gets overall statistics for features associated with the project
featureSchema.statics.getFeatureStatsForProject = function getFeatureStatsForProject(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {
        
        //Count the number of features associated with the project
        var projectCount = mongoose.model('Feature')
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

//Gets all statistics related to the feature with the supplied code
featureSchema.statics.getFeatureStats = function getFeatureStats(projectCode, featureCode) {

    //Return the feature statistics
    return stats(projectCode, featureCode);
};

//Gets all features by project code containing the name criteria
featureSchema.statics.searchForFeature = function searchForFeature(projectCode, name) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the features
        mongoose.model('Feature')
            .find({projectCode: projectCode, name: {$regex: new RegExp(name, 'i')}},
                '-_id code projectCode name')
            .sort('name')
            .exec(function(error, features) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the features
                resolve(features);
            }
        });
    });
};

//Updates an existing feature
featureSchema.statics.updateFeature = function updateFeature(newFeatureData) {
    
    //Return the updated feature
    return update(newFeatureData);
};

//Helper method used to create a new feature
function create(newFeatureData) {

    //Sanitise the data
    newFeatureData = sanitise(newFeatureData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //If the project exists
        mongoose.model('Project').exists(newFeatureData.projectCode).then(function() {

            //Create the feature
            mongoose.model('Feature').create(newFeatureData, function(error, feature) {

                //If an error occurred
                if(error) {

                    //If the error code was 11000
                    if (error.code == 11000) {

                        //Update the error message to be more user friendly
                        error.errmsg = 'A feature with the same code already exists.';
                    }

                    //Return the error
                    reject(error);
                }
                else {

                    //Otherwise, return the feature and project code
                    resolve({code: feature.code, projectCode: feature.projectCode});
                }
            });
        }, function(error) {

            //Return the error
            reject(error);
        });
    });
}

//Gets the feature with the supplied feature code
function get(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the feature
        mongoose.model('Feature')
            .findOne({code: featureCode, projectCode: projectCode},
                '-_id code description name projectCode')
            .exec(function(error, feature) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the feature
                resolve(feature);
            }
        });
    });
}

//Sanitises the supplied feature data and returns only the relevant content
function sanitise(featureData) {

    //Return the sanitised feature data
    return {
        name: featureData.name,
        code: featureData.code,
        description: featureData.description,
        projectCode: featureData.projectCode
    };
}

//Gets all statistics related to the feature with the supplied code
function stats(projectCode, featureCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Get the user story statistics
        var userStoryStats = mongoose.model('UserStory').getUserStoryStatsForFeature(projectCode, featureCode);

        //Get the acceptance test statistics
        var acceptanceTestStats = mongoose.model('AcceptanceTest').getAcceptanceTestStatsForFeature(projectCode, featureCode);

        //If all the promises are successful
        Promise.all([userStoryStats, acceptanceTestStats]).then(function(data) {
            
            //Return the stats
            resolve({
                userStory: data[0],
                acceptanceTest: data[1]
            });

        }, function(error) {
            
            //Return the error message
            reject({code: error.code, message: error.errmsg});
        });
    });
}

//Helper method used to update an existing feature
function update(newFeatureData) {

    //Sanitise the data
    newFeatureData = sanitise(newFeatureData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the feature and update it
        mongoose.model('Feature')
            .findOneAndUpdate({code: newFeatureData.code, projectCode: newFeatureData.projectCode},
                {$set: newFeatureData}, function(error, feature) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the feature wasn't found
            else if (!feature) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Feature not found'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
}

var Feature = mongoose.model('Feature', featureSchema);
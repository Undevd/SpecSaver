var mongoose = require('mongoose');

var featureSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required'},
    code: {type: String, required: '{PATH} is required'},
    description: {type:String},
    projectCode: {type:String, required: '{PATH} is required'}
});

featureSchema.index({code: 1, projectCode: 1}, {unique: true});

//Creates a new feature
featureSchema.statics.createFeature = function createFeature(newFeatureData) {
    
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
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the feature and update it
        mongoose.model('Feature')
            .findOneAndUpdate({code: newFeatureData.code, projectCode: newFeatureData.projectCode},
                newFeatureData, function(error, feature) {

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
};

var Feature = mongoose.model('Feature', featureSchema);
var mongoose = require('mongoose');

var releaseSchema = mongoose.Schema({
    name: { type:String, required:'{PATH} is required'},
    code: {type: String, required: '{PATH} is required'},
    description: {type:String},
    projectCode: {type:String, required: '{PATH} is required'}
});

releaseSchema.index({code: 1, projectCode: 1}, {unique: true});

//Creates a new release
releaseSchema.statics.createRelease = function createRelease(newReleaseData) {
    
    //Return the created release
    return create(newReleaseData);
};

//Creates or update an existing release if it exists
releaseSchema.statics.createOrUpdateRelease = function createOrUpdateRelease(newReleaseData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //If no release data or codes were supplied
        if (!newReleaseData || !newReleaseData.code || !newReleaseData.projectCode) {

            //Return an error
            reject({code: 400, errmsg: 'Invalid release'});
        }
        else {

            //Find the number of releases by code
            mongoose.model('Release')
                .count({code: newReleaseData.code, projectCode: newReleaseData.projectCode})
                .exec(function(error, count) {

                //If an error occurred
                if (error) {

                    //Return the error
                    reject(error);
                }
                //Else if the release couldn't be found
                else if (!count) {

                    //Create it
                    create(newReleaseData).then(function(releaseCode) {

                        //Return the result
                        resolve(releaseCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
                //Else if multiple releases were found
                else if (count > 1) {

                    //Return a 400 error
                    reject({code: 400, errmsg: 'Multiple releases found with the same code'});
                }
                else {

                    //Update it
                    update(newReleaseData).then(function(releaseCode) {

                        //Return the result
                        resolve(releaseCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
            });
        }
    });
};

//Checks whether the release with the supplied code exists
releaseSchema.statics.exists = function exists(projectCode, releaseCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the number of releases by code
        mongoose.model('Release')
            .count({code: releaseCode, projectCode: projectCode})
            .exec(function(error, count) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the release couldn't be found
            else if (!count) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Release not found'});
            }
            //Else if multiple releases were found
            else if (count > 1) {

                //Return a 400 error
                reject({code: 400, errmsg: 'Multiple releases found with the same code'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
};

//Gets all releases by project code
releaseSchema.statics.getAllReleasesByProject = function getAllReleasesByProject(projectCode) {

	//Return a promise
	return new Promise(function(resolve, reject) {

        //Find the releases by project code
        mongoose.model('Release')
            .find({projectCode: projectCode}, '-_id code description name')
            .sort('name')
            .exec(function(error, releases) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the releases
                resolve(releases);
            }
        });
    });
};

//Gets the release with the supplied release code
releaseSchema.statics.getRelease = function getRelease(projectCode, releaseCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the release
        mongoose.model('Release')
            .findOne({code: releaseCode, projectCode: projectCode}, '-_id code description name projectCode')
            .exec(function(error, release) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the release
                resolve(release);
            }
        });
    });
};

//Gets overall statistics for releases associated with the project
releaseSchema.statics.getReleaseStatsForProject = function getReleaseStatsForProject(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {
        
        //Count the number of releases associated with the project
        var projectCount = mongoose.model('Release')
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

//Updates an existing release
releaseSchema.statics.updateRelease = function updateRelease(newReleaseData) {
    
    //Return the updated release
    return update(newReleaseData);
};

//Helper method used to create a new release
function create(newReleaseData) {

    //Sanitise the data
    newReleaseData = sanitise(newReleaseData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //If the project exists
        mongoose.model('Project').exists(newReleaseData.projectCode).then(function() {

            //Create the release
            mongoose.model('Release').create(newReleaseData, function(error, release) {

                //If an error occurred
                if(error) {

                    //If the error code was 11000
                    if (error.code == 11000) {

                        //Update the error message to be more user friendly
                        error.errmsg = 'A release with the same code already exists.';
                    }

                    //Return the error
                    reject(error);
                }
                else {

                    //Otherwise, return the release and project code
                    resolve({code: release.code, projectCode: release.projectCode});
                }
            });
        }, function(error) {

            //Return the error
            reject(error);
        });
    });
}

//Sanitises the supplied release data and returns only the relevant content
function sanitise(releaseData) {

    //Return the sanitised release data
    return {
        name: releaseData.name,
        code: releaseData.code,
        description: releaseData.description,
        projectCode: releaseData.projectCode
    };
}

//Helper method used to update an existing release
function update(newReleaseData) {

    //Sanitise the data
    newReleaseData = sanitise(newReleaseData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the release and update it
        mongoose.model('Release')
            .findOneAndUpdate({code: newReleaseData.code, projectCode: newReleaseData.projectCode},
                newReleaseData, function(error, release) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the release wasn't found
            else if (!release) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Release not found'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
}

var Release = mongoose.model('Release', releaseSchema);
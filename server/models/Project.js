var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    name: {type: String, required:'{PATH} is required'},
    code: {type: String, required: '{PATH} is required', unique: true},
    description: {type: String},
	admins: {type: [String]},
    members: {type: [String]},
    lastStepCode: {type: Number, default: 0},
    lastSystemTestCode: {type: Number, default: 0}
});

projectSchema.methods = { };

//Creates a new project
projectSchema.statics.createProject = function createProject(newProjectData) {
    
    //Return the created project
    return create(newProjectData);
}

//Creates or update an existing project if it exists
projectSchema.statics.createOrUpdateProject = function createOrUpdateProject(newProjectData) {
    
    //Return a promise
    return new Promise(function(resolve, reject) {

        //If no project data or code was supplied
        if (!newProjectData || !newProjectData.code) {

            //Return an error
            reject({code: 400, errmsg: 'Invalid project'});
        }
        else {

            //Find the number of projects by code
            mongoose.model('Project')
                .count({code: newProjectData.code})
                .exec(function(error, count) {

                //If an error occurred
                if (error) {

                    //Return the error
                    reject(error);
                }
                //Else if the project couldn't be found
                else if (!count) {

                    //Create it
                    create(newProjectData).then(function(projectCode) {

                        //Return the result
                        resolve(projectCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
                //Else if multiple projects were found
                else if (count > 1) {

                    //Return a 400 error
                    reject({code: 400, errmsg: 'Multiple projects found with the same code'});
                }
                else {

                    //Update it
                    update(newProjectData).then(function(projectCode) {

                        //Return the result
                        resolve(projectCode);

                    }, function(error) {

                        //Return the error
                        reject(error);
                    });
                }
            });
        }
    });
};

//Checks whether the project with the supplied code exists
projectSchema.statics.exists = function exists(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the number of projects by code
        mongoose.model('Project')
            .count({code: projectCode})
            .exec(function(error, count) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the project couldn't be found
            else if (!count) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Project not found'});
            }
            //Else if multiple projects were found
            else if (count > 1) {

                //Return a 400 error
                reject({code: 400, errmsg: 'Multiple projects found with the same code'});
            }
            else {

                //Otherwise, return successfully
                resolve();
            }
        });
    });
};

//Exports a single project to JSON
projectSchema.statics.exportProject = function exportProject(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Get all the data relating to the project
        var project = mongoose.model('Project').findOne({code: projectCode}, '-_id -__v').exec();
        var releases = mongoose.model('Release').find({projectCode: projectCode}, '-_id -__v').exec();
        var features = mongoose.model('Feature').find({projectCode: projectCode}, '-_id -__v').exec();
        var userStories = mongoose.model('UserStory').find({projectCode: projectCode}, '-_id -__v').exec();
        var acceptanceTests = mongoose.model('AcceptanceTest').find({projectCode: projectCode}, '-_id -__v').exec();
        var steps = mongoose.model('Step').find({projectCode: projectCode}, '-_id -__v').exec();
        var systemTests = mongoose.model('SystemTest').find({projectCode: projectCode}, '-_id -__v').exec();

        //If all the promises are successful
        Promise.all([project, releases, features, userStories, acceptanceTests, steps, systemTests]).then(function(data) {

            //Return the project data
            resolve({
                project: data[0],
                releases: data[1],
                features: data[2],
                userStories: data[3],
                acceptanceTests: data[4],
                steps: data[5],
                systemTests: data[6]
            });

        }, function(error) {
            
            //Otherwise return the error
            reject(error);
        });
    });
};

//Gets all created projects
projectSchema.statics.getAllProjects = function getAllProjects() {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Get all projects sorted by name
        mongoose.model('Project')
            .find({}, '-_id admins code description members name')
            .sort('name')
            .exec(function(error, projects) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            else {
                
                //Otherwise, return the projects
                resolve(projects);
            }
        });
    });
}

//Gets a single project by project code
projectSchema.statics.getProject = function getProject(projectCode) {

    //Return the project data
    return get(projectCode);
};

//Gets a single project by project code, along with all related statistics
projectSchema.statics.getProjectExpanded = function getProjectExpanded(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Get the project
        var project = get(projectCode);

        //Get the statistics
        var statistics = stats(projectCode);

        //If all the promises are successful
        Promise.all([project, statistics]).then(function(data) {
            
            //Return the project and statistics
            resolve({
                project: data[0],
                stats: data[1]
            });

        }, function(error) {
            
            //Return the error message
            reject({code: error.code, message: error.errmsg});
        });
    });
};

//Gets all statistics related to the project with the supplied code
projectSchema.statics.getProjectStats = function getProjectStats(projectCode) {

    //Return the project statistics
    return stats(projectCode);
};

//Updates the project with the supplied project code
projectSchema.statics.updateProject = function updateProject(newProjectData) {

    //Return the updated project
    return update(newProjectData);
};

//Helper method used to create a new project
function create(newProjectData) {
    
    //Sanitise the data
    newProjectData = sanitise(newProjectData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Create the project
        mongoose.model('Project').create(newProjectData, function(error, project) {

            //If an error occurred
            if(error) {

                //If the error code was 11000
                if (error.code == 11000) {

                    //Update the error message to be more user friendly
                    error.errmsg = 'A project with the same code already exists.';
                }

                //Return the error
                reject(error);
            }
            else {

                //Otherwise, return the project code
                resolve(project.code);
            }
        });
    });
}

//Gets a single project by project code
function get(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the project by code
        mongoose.model('Project')
            .findOne({code: projectCode}, '-_id admins code description members name')
            .exec(function(error, project) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the project couldn't be found
            else if (!project) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Project not found'});
            }
            else {

                //Otherwise, return the project
                resolve(project);
            }
        });
    });
}

//Sanitises the supplied project data and returns only the relevant content
function sanitise(projectData) {

    //Return the sanitised project data
    return {
        name: projectData.name,
        code: projectData.code,
        description: projectData.description,
        admins: projectData.admins,
        members: projectData.members
    };
}

//Gets all statistics related to the project with the supplied code
function stats(projectCode) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Get the release statistics
        var releaseStats = mongoose.model('Release').getReleaseStatsForProject(projectCode);

        //Get the feature statistics
        var featureStats = mongoose.model('Feature').getFeatureStatsForProject(projectCode);

        //Get the user story statistics
        var userStoryStats = mongoose.model('UserStory').getUserStoryStatsForProject(projectCode);

        //Get the acceptance test statistics
        var acceptanceTestStats = mongoose.model('AcceptanceTest').getAcceptanceTestStatsForProject(projectCode);

        //Get the system test statistics
        var systemTestStats = mongoose.model('SystemTest').getSystemTestStatsForProject(projectCode);

        //If all the promises are successful
        Promise.all([releaseStats, featureStats, userStoryStats, acceptanceTestStats, systemTestStats]).then(function(data) {
            
            //Return the stats
            resolve({
                release: data[0],
                feature: data[1],
                userStory: data[2],
                acceptanceTest: data[3],
                systemTest: data[4]
            });

        }, function(error) {
            
            //Return the error message
            reject({code: error.code, message: error.errmsg});
        });
    });
}

//Helper method used to update the project with the supplied project code
function update(newProjectData) {

    //Sanitise the data
    newProjectData = sanitise(newProjectData);

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the project by code and update it
        mongoose.model('Project')
            .findOneAndUpdate({code: newProjectData.code}, {$set: newProjectData}, function(error, project) {

            //If an error occurred
            if (error) {

                //Return the error
                reject(error);
            }
            //Else if the project wasn't found
            else if (!project) {

                //Return a 404 error
                reject({code: 404, errmsg: 'Project not found'});
            }
            else {

                //Otherwise, return the project code
                resolve(project.code);
            }
        });
    });
}

var Project = mongoose.model('Project', projectSchema);

function createInitialProject() {
    Project.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Project.create({name: "SpecSaver", code: "SpecSaver", description: "Testing tool.", members: ["Zeroish", "Batman"]});
            Project.create({name: "Contact360", code: "C360", description: "Customer contact platform.", members: ["Superman", "Batman"]});
            Project.create({name: "NIROS", code: "NIROS", description: "Backend processing for registering all life events.", members: ["Zeroish", "IronMan", "TheCaptain"]});
        }
    });
}

exports.createInitialProject = createInitialProject;
var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    name: {type: String, required:'{PATH} is required'},
    code: {type: String, required: '{PATH} is required', unique: true},
    description: {type: String},
	admins: {type: [String]},
    members: {type: [String]}
});

projectSchema.methods = { };

//Creates a new project
projectSchema.statics.createProject = function createProject(newProjectData) {
    
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
};

//Updates the project with the supplied project code
projectSchema.statics.updateProject = function updateProject(newProjectData) {

    //Return a promise
    return new Promise(function(resolve, reject) {

        //Find the project by code and update it
        mongoose.model('Project')
            .findOneAndUpdate({code: newProjectData.code}, newProjectData, function(error, project) {

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

                //Otherwise, return successfully
                resolve();
            }
        });
    });
};

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
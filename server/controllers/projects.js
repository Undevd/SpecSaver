var Project = require('mongoose').model('Project');

//Creates a new project
exports.createProject = function(request, response) {

    //Get the project data from the request
    var projectData = request.body;

    //Sanitise the data
    var newProjectData = {
        name: projectData.name,
        code: projectData.code,
        description: projectData.description,
        admins: projectData.admins,
        members: projectData.members
    };

    //Create the project
    Project.create(newProjectData, function(error, project) {

        //If an error occurred
        if(error) {

            //If the error code was 11000
            if (error.code == 11000) {

                //Update the error message to be more user friendly
                error.errmsg = 'A project with the same code already exists.';
            }

            //Set the error status and send the error message
            response.status(400).send({code: error.code, message: error.errmsg});
        }
        else {

            //Set the success status and send the new project code
            response.status(201).send({code: project.code});
        }
    });
}

//Gets all created projects
exports.getAllProjects = function(request, response) {

    //Get all projects sorted by name
    Project.find({}, '-_id admins code description members name').sort('name').exec(function(error, projects) {

        //If an error occurred
        if (error) {

            //Set the error status and send the error message
            response.status(400).send({code: error.code, message: error.errmsg});
        }
        else {
            
            //Set the success status and send the projects
            response.status(200).send(projects);
        }
    })
}

//Gets the project with the supplied project code
exports.getProject = function(request, response) {

    //Find the project by code
    Project.findOne({code: request.params.projectCode}, '-_id admins code description members name').exec(function(error, project) {

        //If an error occurred
        if (error) {

            //Set the error status and send the error message
            response.status(400).send({code: error.code, message: error.errmsg});
        }
        //Else if the project wasn't found
        else if (!project) {

            //Set the error status and send the error message
            response.status(404).send({code: 404, message: 'Project not found'});
        }
        else {

            //Set the success status and send the project
            response.status(200).send(project);
        }
    })
}

//Updates the project with the supplied project code
exports.updateProject = function(request, response) {
    
    //Get the project data from the request
    var projectData = request.body;

    //Sanitise the data
    var newProjectData = {
        name: projectData.name,
        code: projectData.code,
        description: projectData.description,
        admins: projectData.admins,
        members: projectData.members
    };

    //Find the project by code and update it
    Project.findOneAndUpdate({code: newProjectData.code}, newProjectData, function(error, project) {

        //If an error occurred
        if (error) {

            //Set the error status and send the error message
            response.status(400).send({code: error.code, message: error.errmsg});
        }
        //Else if the project wasn't found
        else if (!project) {

            //Set the error status and send the error message
            response.status(404).send({code: 404, message: 'Project not found'});
        }
        else {

            //Set and send the success status
            response.sendStatus(200);
        }
    });
};
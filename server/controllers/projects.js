var Project = require('mongoose').model('Project');

//Creates a new project
exports.createProject = function(request, response) {

    //Create the project
    Project.create(request.body, function(error, project) {

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

exports.getProject = function(req, res) {
    Project.findOne({ code: req.params.projectCode }).exec(function(err, project) {
        if (project != null) {
            res.send(project);
        }
        else {
            res.sendStatus(404);
        }
    })
}

exports.updateProject = function(req, res) {
    var projectData = req.body;
    Project.findOneAndUpdate({code: projectData.code}, projectData, function(err, project) {
        if(err) {
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(200);
        res.send(project);
    });
};
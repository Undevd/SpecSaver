var Project = require('mongoose').model('Project');

exports.createProject = function(req, res) {
    var projectData = req.body;
    Project.create(projectData, function(err, project) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(201);
        res.send(project);
    });
}

exports.getAllProjects = function(req, res) {
    Project.find({}).exec(function(err, projects) {
        res.send(projects);
    })
}

exports.getProject = function(req, res) {
    Project.findOne({ _id: req.params.projectId }).exec(function(err, project) {
        res.send(project);
    })
}

exports.updateProject = function(req, res) {
    var projectData = req.body;
    Project.findOneAndUpdate({_id: projectData._id}, projectData, function(err, project) {
        if(err) {
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(200);
        res.send(project);
    });
};
var Project = require('mongoose').model('Project');

exports.getProject = function(req, res) {
    Project.find({}).exec(function(err, collection) {
        console.log(collection);
        res.send(collection);
    })
};

exports.createProject = function(req, res, next) {
    var projectData = req.body;
    Project.create(projectData, function(err, quote) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }
        res.status(201);
    });
}
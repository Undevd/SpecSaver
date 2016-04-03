var Project = require('mongoose').model('Project');
var Release = require('mongoose').model('Release');

exports.createRelease = function(req, res) {
    var releaseData = req.body;
    Release.create(releaseData, function(err, release) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(201);
        res.send(release);
    });
};

exports.getAllReleases = function(req, res) {

    //Get all releases associated with the project code
    Release.find({projectCode: req.params.projectCode}, '-_id code description name').sort('name').exec(function(error, releases) {
        
        //If an error occurred
        if (error) {

            //Send a 400 error
            res.sendStatus(400);
        }
        else {
            
            //Get the project data associated with the releases
            Project.findOne({code: req.params.projectCode}, '-_id code name').exec(function(error, project) {

                //If an error occurred
                if (error) {
                     
                     //Send a 400 error
                    res.sendStatus(400);
                }
                //Else if the project wasn't found
                else if (project == null) {

                    //Send a 404 error
                    res.sendStatus(404);
                }
                else {

                    //Otherwise, Send the project and release data
                    res.send({project: project, releases: releases});
                }
            });
        }
    })
};

exports.getRelease = function(req, res) {

    //Get the release data
    Release.findOne({code: req.params.releaseCode, projectCode: req.params.projectCode}, '-_id code description name').exec(function(error, release) {

        //If an error occurred
        if (error) {

            //Send a 400 error
            res.sendStatus(400);
        }
        //Else if the release wasn't found
        else if (release == null) {

            //Send a 404 error
            res.sendStatus(404);
        }
        else {

            //Get the project data associated with the release
            Project.findOne({code: req.params.projectCode}, '-_id code name').exec(function(error, project) {

                //If an error occurred
                if (error) {
                    
                    //Send a 400 error
                    res.sendStatus(400);
                }
                //Else if the project wasn't found
                else if (project == null) {

                    //Send a 404 error
                    res.sendStatus(404);
                }
                else {

                    //Send the project and release data
                    res.send({project: project, release: release});
                }
            })
        }
    })
};

exports.getReleaseCountForProject = function(req, res) {
    Release.count({projectCode: req.params.projectCode}).exec(function(err, count) {
        res.send({count: count});
    });
};

exports.updateRelease = function(req, res) {
    var releaseData = req.body;
    Release.findOneAndUpdate({code: releaseData.code, projectCode: releaseData.projectCode}, releaseData, function(err, release) {
        if(err) {
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(200);
        res.send(release);
    });
};
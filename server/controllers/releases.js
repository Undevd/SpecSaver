var Project = require('mongoose').model('Project');
var Release = require('mongoose').model('Release');

//Creates a new release
exports.createRelease = function(request, response) {

    //Create the release
    Release.createRelease(request.body).then(function(data) {

        //Set the success status and send the new release and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all created releases by project
exports.getAllReleasesByProject = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the releases
    var releases = Release.getAllReleasesByProject(request.params.projectCode);

    //If all the promises are successful
    Promise.all([project, releases]).then(function(data) {
        
        //Set the success status and send the project and releases data
        response.status(200).send({project: data[0], releases: data[1]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets the release with the supplied release code
exports.getRelease = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the release
    var release = Release.getRelease(request.params.projectCode, request.params.releaseCode);

    //If all the promises are successful
    Promise.all([project, release]).then(function(data) {
        
        //Set the success status and send the project and release data
        response.status(200).send({project: data[0], release: data[1]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing release
exports.updateRelease = function(request, response) {
    
    //Update the release
    Release.updateRelease(request.body).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
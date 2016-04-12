var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');

//Creates a new feature
exports.createFeature = function(request, response) {

    //Get the feature data from the request
    var featureData = request.body;

    //Sanitise the data
    var newFeatureData = {
        name: featureData.name,
        code: featureData.code,
        description: featureData.description,
        projectCode: featureData.projectCode
    };

    //Create the feature
    Feature.createFeature(newFeatureData).then(function(data) {

        //Set the success status and send the new feature and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all created features by project
exports.getAllFeaturesByProject = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the features
    var features = Feature.getAllFeaturesByProject(request.params.projectCode);

    //If all the promises are successful
    Promise.all([project, features]).then(function(data) {
        
        //Set the success status and send the project and features data
        response.status(200).send({project: data[0], features: data[1]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all created features by release
exports.getAllFeaturesByRelease = function(request, response) {
    
    //Not implemented
    response.sendStatus(501);
};

//Gets the feature with the supplied feature code
exports.getFeature = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the feature
    var feature = Feature.getFeature(request.params.projectCode, request.params.featureCode);

    //If all the promises are successful
    Promise.all([project, feature]).then(function(data) {
        
        //Set the success status and send the project and features data
        response.status(200).send({project: data[0], feature: data[1]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

exports.getFeatureCountByProject = function(request, response) {
    Feature.count({projectCode: request.params.projectCode}).exec(function(error, count) {
        response.send({count: count});
    });
};

exports.getFeatureCountByRelease = function(request, response) {
    response.send({count: "TBC"});
};

//Updates an existing feature
exports.updateFeature = function(request, response) {
    
    //Get the feature data from the request
    var featureData = request.body;

    //Sanitise the data
    var newFeatureData = {
        name: featureData.name,
        code: featureData.code,
        description: featureData.description,
        projectCode: featureData.projectCode
    };

    //Update the feature
    Feature.updateFeature(newFeatureData).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
var AcceptanceTest = require('mongoose').model('AcceptanceTest');
var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var UserStory = require('mongoose').model('UserStory');

//Creates a new feature
exports.createFeature = function(request, response) {

    //Create the feature
    Feature.createFeature(request.body).then(function(data) {

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

    //Get the user story statistics
    var userStoryStats = UserStory.getUserStoryStatsForFeature(request.params.projectCode, request.params.featureCode);

    //Get the acceptance test statistics
    var acceptanceTestStats = AcceptanceTest.getAcceptanceTestStatsForFeature(request.params.projectCode, request.params.featureCode);

    //If all the promises are successful
    Promise.all([project, feature, userStoryStats, acceptanceTestStats]).then(function(data) {
        
        //Set the success status and send the project and features data
        response.status(200).send({project: data[0], feature: data[1], stats: {userStory: data[2], acceptanceTest: data[3]}});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Searches for a feature using the supplied project code and name criteria
exports.searchForFeature = function(request, response) {

    //Get the search criteria from the request
    var projectCode = request.params.projectCode;
    var name = request.params.name;

    //Search for any matching results
    Feature.searchForFeature(projectCode, name).then(function(data) {

        //Set the success status and send the search results
        response.status(200).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing feature
exports.updateFeature = function(request, response) {
    
    //Update the feature
    Feature.updateFeature(request.body).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
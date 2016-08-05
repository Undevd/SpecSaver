var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var UserStory = require('mongoose').model('UserStory');

//Creates a new user story
exports.createUserStory = function(request, response) {
    
    //Create the user story
    UserStory.createUserStory(request.body).then(function(data) {

        //Set the success status and send the new user story, feature, and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.message});
    });
};

//Gets all user stories by feature code
exports.getAllUserStoriesByFeature = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the feature
    var feature = Feature.getFeatureExpanded(request.params.projectCode, request.params.featureCode);

    //Get the user stories
    var userStories = UserStory.getAllUserStoriesByFeature(request.params.projectCode, request.params.featureCode);

    //If all the promises are successful
    Promise.all([project, feature, userStories]).then(function(data) {
        
        //Set the success status and send the project, feature, and user stories data
        response.status(200).send({
            project: data[0],
            feature: data[1].feature,
            userStories: data[2],
            stats: data[1].stats
        });

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets the user story with the supplied user story code
exports.getUserStory = function(request, response) {

    //Get the feature
    var feature = Feature.getFeatureExpanded(request.params.projectCode, request.params.featureCode);

    //Get the user story
    var userStory = UserStory.getUserStory(request.params.projectCode, request.params.featureCode, request.params.userStoryCode);

    //If all the promises are successful
    Promise.all([feature, userStory]).then(function(data) {
        
        //Set the success status and send the project, feature, and user story data
        response.status(200).send({
            project: data[0].project,
            feature: data[0].feature,
            userStory: data[1],
            stats: {
                acceptanceTest: data[0].stats.acceptanceTest
            }
        });

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Searches for a user story using the supplied project code and name / code criteria
exports.searchForUserStory = function(request, response) {

    //Get the search criteria from the request
    var projectCode = request.params.projectCode;
    var criteria = request.params.criteria;

    //Search for any matching results
    UserStory.searchForUserStory(projectCode, criteria).then(function(data) {

        //Set the success status and send the search results
        response.status(200).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.name, message: error.message});
    });
};

//Updates an existing user story
exports.updateUserStory = function(request, response) {
    
    //Update the user story
    UserStory.updateUserStory(request.body).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
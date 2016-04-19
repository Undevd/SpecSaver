var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var UserStory = require('mongoose').model('UserStory');

//Creates a new user story
exports.createUserStory = function(request, response) {
    
    //Get the user story data from the request
    var userStoryData = request.body;

    //Sanitise the data
    var newUserStoryData = {
        asA: userStoryData.asA,
        iCan: userStoryData.iCan,
        code: null,
        soThat: userStoryData.soThat,
        projectCode: userStoryData.projectCode,
        featureCode: userStoryData.featureCode
    };

    //Create the user story
    UserStory.createUserStory(newUserStoryData).then(function(data) {

        //Set the success status and send the new user story, feature, and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all user stories by feature code
exports.getAllUserStories = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the feature
    var feature = Feature.getFeature(request.params.projectCode, request.params.featureCode);

    //Get the user stories
    var userStories = UserStory.getAllUserStories(request.params.projectCode, request.params.featureCode);

    //If all the promises are successful
    Promise.all([project, feature, userStories]).then(function(data) {
        
        //Set the success status and send the project, feature, and user stories data
        response.status(200).send({project: data[0], feature: data[1], userStories: data[2]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets the user story with the supplied user story code
exports.getUserStory = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the feature
    var feature = Feature.getFeature(request.params.projectCode, request.params.featureCode);

    //Get the user story
    var userStory = UserStory.getUserStory(request.params.projectCode, request.params.featureCode, request.params.userStoryCode);

    //If all the promises are successful
    Promise.all([project, feature, userStory]).then(function(data) {
        
        //Set the success status and send the project, feature, and user story data
        response.status(200).send({project: data[0], feature: data[1], userStory: data[2]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing user story
exports.updateUserStory = function(request, response) {
    
    //Get the user story data from the request
    var userStoryData = request.body;

    //Sanitise the data
    var newUserStoryData = {
        asA: userStoryData.asA,
        code: userStoryData.code,
        iCan: userStoryData.iCan,
        soThat: userStoryData.soThat,
        projectCode: userStoryData.projectCode,
        featureCode: userStoryData.featureCode
    };

    //Update the user story
    UserStory.updateUserStory(newUserStoryData).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
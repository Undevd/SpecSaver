var AcceptanceTest = require('mongoose').model('AcceptanceTest');
var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var SystemTest = require('mongoose').model('SystemTest');
var UserStory = require('mongoose').model('UserStory');

//Creates a new acceptance test
exports.createAcceptanceTest = function(request, response) {
    
    //Create the acceptance test
    AcceptanceTest.createAcceptanceTest(request.body).then(function(data) {

        //Set the success status and send the new acceptance test, feature, and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all acceptance tests by feature code
exports.getAllAcceptanceTestsByFeature = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the feature
    var feature = Feature.getFeature(request.params.projectCode, request.params.featureCode);

    //Get the acceptance tests
    var acceptanceTests = AcceptanceTest.getAllAcceptanceTestsByFeature(request.params.projectCode, request.params.featureCode);

    //If all the promises are successful
    Promise.all([project, feature, acceptanceTests]).then(function(data) {
        
        //Set the success status and send the project, feature, and acceptance tests data
        response.status(200).send({project: data[0], feature: data[1], acceptanceTests: data[2]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets the acceptance test with the supplied acceptance test code
exports.getAcceptanceTest = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the feature
    var feature = Feature.getFeature(request.params.projectCode, request.params.featureCode);

    //Get the acceptance test
    var acceptanceTest = AcceptanceTest.getAcceptanceTestExpanded(request.params.projectCode, request.params.featureCode, request.params.acceptanceTestCode);

    //Get the associated system tests
    var systemTests = SystemTest.getAllSystemTestsByAcceptanceTest(request.params.projectCode, request.params.featureCode, request.params.acceptanceTestCode);

    //If all the promises are successful
    Promise.all([project, feature, acceptanceTest, systemTests]).then(function(data) {
        
        //Set the success status and send the returned data
        response.status(200).send({
            project: data[0],
            feature: data[1],
            acceptanceTest: data[2].acceptanceTest,
            userStories: data[2].userStories,
            systemTests: data[3]
        });

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Searches for an acceptance test using the supplied project code and name / code criteria
exports.searchForAcceptanceTest = function(request, response) {

    //Get the search criteria from the request
    var projectCode = request.params.projectCode;
    var criteria = request.params.criteria;

    //Search for any matching results
    AcceptanceTest.searchForAcceptanceTest(projectCode, criteria).then(function(data) {

        //Set the success status and send the search results
        response.status(200).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.name, message: error.message});
    });
};

//Updates an existing acceptance test
exports.updateAcceptanceTest = function(request, response) {
    
    //Update the acceptance test
    AcceptanceTest.updateAcceptanceTest(request.body).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
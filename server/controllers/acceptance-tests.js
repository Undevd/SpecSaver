var AcceptanceTest = require('mongoose').model('AcceptanceTest');
var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');

//Creates a new acceptance test
exports.createAcceptanceTest = function(request, response) {
    
    //Get the acceptance test data from the request
    var acceptanceTestData = request.body;

    //Sanitise the data
    var newAcceptanceTestData = {
        code: null,
        given: acceptanceTestData.given,
        when: acceptanceTestData.when,
        then: acceptanceTestData.then,
        projectCode: acceptanceTestData.projectCode,
        featureCode: acceptanceTestData.featureCode
    };

    //Create the acceptance test
    AcceptanceTest.createAcceptanceTest(newAcceptanceTestData).then(function(data) {

        //Set the success status and send the new acceptance test, feature, and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all acceptance tests by feature code
exports.getAllAcceptanceTests = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the feature
    var feature = Feature.getFeature(request.params.projectCode, request.params.featureCode);

    //Get the acceptance tests
    var acceptanceTests = AcceptanceTest.getAllAcceptanceTests(request.params.projectCode, request.params.featureCode);

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
    var acceptanceTest = AcceptanceTest.getAcceptanceTest(request.params.projectCode, request.params.featureCode, request.params.acceptanceTestCode);

    //If all the promises are successful
    Promise.all([project, feature, acceptanceTest]).then(function(data) {
        
        //Set the success status and send the project, feature, and acceptance test data
        response.status(200).send({project: data[0], feature: data[1], acceptanceTest: data[2]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

exports.getAcceptanceTestCountForFeature = function(req, res) {

    //Count the number of acceptance tests associated with the feature
    AcceptanceTest.count({projectCode: req.params.projectCode, featureCode: req.params.featureCode}).exec(function(error, count) {
        
        //Send the total count
        res.send({count: count});
    });
};

exports.getAcceptanceTestCountForProject = function(req, res) {

    //Count the number of acceptance tests associated with the project
    AcceptanceTest.count({projectCode: req.params.projectCode}).exec(function(error, count) {

        //Send the total count
        res.send({count: count});
    });
};

exports.getAcceptanceTestCountForUserStory = function(req, res) {

    //Not implemented
    res.sendStatus(501);
};

exports.getAcceptanceTestCountGroupedByFeature = function(req, res) {;
    AcceptanceTest.aggregate([{$match: {projectCode: req.params.projectCode}}, {$group: {_id: "$featureCode", total: {$sum: 1}}}]).sort('_id').exec(function(err, result) {
        res.send(result);
    });
};

//Updates an existing acceptance test
exports.updateAcceptanceTest = function(request, response) {
    
    //Get the acceptance test data from the request
    var acceptanceTestData = request.body;

    //Sanitise the data
    var newAcceptanceTestData = {
        code: null,
        given: acceptanceTestData.given,
        when: acceptanceTestData.when,
        then: acceptanceTestData.then,
        projectCode: acceptanceTestData.projectCode,
        featureCode: acceptanceTestData.featureCode
    };

    //Update the acceptance test
    AcceptanceTest.updateAcceptanceTest(newAcceptanceTestData).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
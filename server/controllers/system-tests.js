var Feature = require('mongoose').model('Feature');
var Project = require('mongoose').model('Project');
var Step = require('mongoose').model('Step');
var SystemTest = require('mongoose').model('SystemTest');

//Creates a new system test
exports.createSystemTest = function(request, response) {

    //Get the system test data from the request
    var systemTestData = request.body;

    //Sanitise the data
    var newSystemTestData = {
        name: systemTestData.name,
        code: null,
        description: systemTestData.description,
        projectCode: systemTestData.projectCode,
        featureCodes: [],
        acceptanceTestCodes: [],
        stepArguments: []
    };

    //Create the system test
    SystemTest.createSystemTest(newSystemTestData).then(function(data) {

        //Set the success status and send the new system test and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets all created system tests by project
exports.getAllSystemTestsByProject = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the system tests
    var systemTests = SystemTest.getAllSystemTestsByProject(request.params.projectCode);

    //If all the promises are successful
    Promise.all([project, systemTests]).then(function(data) {
        
        //Set the success status and send the project and system tests data
        response.status(200).send({project: data[0], systemTests: data[1]});

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Gets the system test with the supplied system test code
exports.getSystemTest = function(request, response) {

    //Get the project
    var project = Project.getProject(request.params.projectCode);

    //Get the system test and test steps
    var systemTest = SystemTest.getSystemTestExpanded(request.params.projectCode, request.params.systemTestCode);

    //If all the promises are successful
    Promise.all([project, systemTest]).then(function(data) {
        
        //Set the success status and send the feature, project, system test, and test step data
        response.status(200).send({
            acceptanceTests: data[1].acceptanceTests,
            features: data[1].features,
            project: data[0],
            systemTest: data[1].systemTest,
            steps: data[1].steps
        });

    }, function(error) {
        
        //Otherwise, set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing system test
exports.updateSystemTest = function(request, response) {
    
    //Get the system test data from the request
    var systemTestData = request.body;

    //Sanitise the data
    var newSystemTestData = {
        name: systemTestData.name,
        code: systemTestData.code,
        description: systemTestData.description,
        projectCode: systemTestData.projectCode,
        featureCodes: [],
        acceptanceTestCodes: [],
        stepArguments: []
    };

    //For each feature code
    for (var featureCode of systemTestData.featureCodes) {
        
        //If the value is a string or a number
        //and it isn't already in the list
        if ((typeof featureCode === "string" || typeof featureCode === "number")
            && newSystemTestData.featureCodes.indexOf(featureCode) < 0) {

            //Add the value to the updated system test
            newSystemTestData.featureCodes.push(featureCode);
        }
    }

    //For each acceptance test
    for (var acceptanceTest of systemTestData.acceptanceTestCodes) {
        
        //If the code is a number
        //and the feature code is a string or a number
        //and it isn't already in the list
        if (typeof acceptanceTest.code === "number"
            && (typeof acceptanceTest.featureCode === "string"
                || typeof acceptanceTest.featureCode === "number")
            && newSystemTestData.acceptanceTestCodes.map(function(e) {
                return e.featureCode + ',' + e.code
            }).indexOf(acceptanceTest.featureCode + ',' + acceptanceTest.code) < 0) {

            //Add the values to the updated system test
            newSystemTestData.acceptanceTestCodes.push({
                code: acceptanceTest.code,
                featureCode: acceptanceTest.featureCode
            });
        }
    }

    //For each test step
    for (var step of systemTestData.stepArguments) {
        
        //Create a new object to store the sanitised arguments
        var stepArguments = {
            code: step.code,
            arguments: []
        }; 
   
        //If there are arguments defined
        if (step.arguments) {
            
            //For each argument
            for (var argument of step.arguments) {
                
                //Add a sanitised version of the argument to the new object
                stepArguments.arguments.push({name: argument.name, value: argument.value});
            }
        }
        
        //Add the object to the updated system test
        newSystemTestData.stepArguments.push(stepArguments);
    }

    //Update the system test
    SystemTest.updateSystemTest(newSystemTestData).then(function() {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
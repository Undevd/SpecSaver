var Project = require('mongoose').model('Project');
var Step = require('mongoose').model('Step');
var SystemTest = require('mongoose').model('SystemTest');

//Adds a test step to a system test at the specified position
exports.addStep = function(request, response) {

    //Search for any matching results
    Step.addStep(request.body).then(function(data) {

        //Get the updated system test and test steps
        SystemTest.getSystemTestExpanded(request.body.projectCode, request.body.systemTestCode).then(function(data) {

            //Set the success status and send the feature, system test, and test step data
            response.status(200).send({
                features: data.features,
                systemTest: data.systemTest,
                steps: data.steps
            });

        }, function(error) {
            
            //Otherwise, set the error status and send the error message
            response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
        });

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Creates a new test step
exports.createStep = function(request, response) {

    //Create the step
    Step.createStep(request.body).then(function(data) {

        //Set the success status and send the new test step and project codes
        response.status(201).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

exports.getSteps = function(req, res) {
    Step.find({}).exec(function(err, steps) {
        res.send(steps);
    })
};

//Imports the supplied SpecFlow steps
exports.importSpecFlowSteps = function(request, response) {

    //The start and end placeholder regex characters
    var START_REGEX = '(';
    var END_REGEX = ')';

    //The start and end placeholder parameter characters
    var START_PARAMETER = '{';
    var END_PARAMETER = '}';
    
    //Get the project code
    var projectCode = request.params.projectCode;

    //Get the data from the request
    var data = request.body;

    //If a project code and data was supplied
    if (projectCode && data) {

        //Check that the project exists
        Project.exists(projectCode).then(function() {

            //Store an array of the populated promises
            var promises = [];

            //Get the file step definitions
            var files = data.ProjectStepDefinitions.FileStepDefinitions;

            //If any files exist
            if (files) {

                //For each file
                for (var file of files) {
                    
                    //Get the step definitions
                    var steps = file.StepDefinitions;

                    //If any steps exist
                    if (steps) {

                        //For each step
                        for (var step of steps) {

                            //Get the step type
                            var type = step.StepDefinitionType;

                            //Convert the type from an integer into a string
                            switch (type) {

                                case 1: type = 'Given'; break;
                                case 2: type = 'When'; break;
                                case 3: type = 'Then'; break;
                            }

                            //Get the step pattern
                            var pattern = step.Regex.pattern;

                            //Get the parameters
                            var parameters = step.Parameters;

                            //If any parameters exist
                            if (parameters) {
                                
                                //For each parameter
                                for (var parameter of parameters) {

                                    //Get the parameter name
                                    var name = parameter.ParameterName;

                                    //Get the parameter type
                                    var parameterType = parameter.Type.FullName;

                                    //If the parameter type is for a SpecFlow table
                                    if (parameterType == 'TechTalk.SpecFlow.Table') {

                                        //TBC
                                        //...
                                    }
                                    else {
                                        
                                        //Get the start and end positions of the first regex placeholder
                                        //These are enclosed in brackets
                                        var startPos = pattern.indexOf(START_REGEX);
                                        var endPos = pattern.indexOf(END_REGEX);

                                        //If a placeholder exists
                                        if (startPos > -1 && endPos > startPos) {

                                            //Replace the placeholder with the parameter name
                                            //e.g. When I click '(.*)' -> When I click '{button}'
                                            pattern = pattern.substring(0, startPos)
                                                + START_PARAMETER
                                                + name
                                                + END_PARAMETER
                                                + pattern.substring(endPos + 1, pattern.length);
                                        }
                                    }
                                }
                            }
                            
                            //Create a new promise to create or update the step
                            promises.push(Step.importStep({
                                type: type,
                                step: pattern,
                                projectCode: projectCode
                            }));
                        }
                    }
                }
            }

            //If no valid data has been supplied
            if (!promises.length) {

                //Return an error
                response.status(400).send({code: 400, message: 'No valid data supplied'});
            }

            //If all the promises are successful
            Promise.all(promises).then(function(responses) {
                
                //Set and send the success status
                response.sendStatus(200);

            }, function(error) {
                
                //Otherwise, set the error status and send the error message
                response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
            });
        }, function(error) {

            //Otherwise, set the error status and send the error message
            response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
        });
        
    }
};

//Searches for a test step using the supplied Project Code, Type, and Step criteria
exports.searchForStep = function(request, response) {

    //Get the search criteria from the request
    var projectCode = request.params.projectCode;
    var type = request.params.type;
    var step = request.params.step;

    //Search for any matching results
    Step.searchForStep(projectCode, type, step).then(function(data) {

        //Set the success status and send the search results
        response.status(200).send(data);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};

//Updates an existing test step
exports.updateStep = function(request, response) {

    //Update the step
    Step.updateStep(request.body).then(function(data) {

        //Set and send the success status
        response.sendStatus(200);

    }, function(error) {

        //Set the error status and send the error message
        response.status(error.code == 404 ? 404 : 400).send({code: error.code, message: error.errmsg});
    });
};
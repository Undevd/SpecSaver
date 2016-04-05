var AcceptanceTest = require('mongoose').model('AcceptanceTest');

exports.createAcceptanceTest = function(req, res) {
    
    //Get the acceptance test data from the request
    var acceptanceTestData = req.body;

    //Get the latest acceptance test assigned to the feature in the project
    AcceptanceTest.findOne({projectCode: acceptanceTestData.projectCode, featureCode: acceptanceTestData.featureCode}).sort('-code').exec(function(error, latestAcceptanceTest) {

        //Assign a new code to the acceptance test, starting from 1 if none exists
        acceptanceTestData.code = (latestAcceptanceTest == null? 1 : latestAcceptanceTest.code + 1);

        //Create the acceptance test
        AcceptanceTest.create(acceptanceTestData, function(error, acceptanceTest) {

            //If an error occurred
            if(error) {

                //If the error was E11000
                if(error.toString().indexOf('E11000') > -1) {

                    //Update the error message
                    error = new Error('A duplicate exists');
                }

                //Set the error status
                res.status(400);

                //Send the error message
                res.send({reason:error.toString()});
            }
            else {

                //Set the success status
                res.status(201);

                //Send the added acceptance test
                res.send(acceptanceTest);
            }
        });
    });
};

exports.getAllAcceptanceTests = function(req, res) {

    //Not implemented
    res.sendStatus(501);
};

exports.getAcceptanceTest = function(req, res) {

    //Get the acceptance test data
    AcceptanceTest.findOne({code: req.params.acceptanceTestCode, projectCode: req.params.projectCode, featureCode: req.params.featureCode}, '-_id code given then when').exec(function(error, acceptanceTest) {

        //If an error occurred
        if (error) {

            //Send a 400 error
            res.sendStatus(400);
        }
        //Else if the acceptance test wasn't found
        else if (acceptanceTest == null) {

            //Send a 404 error
            res.sendStatus(404);
        }
        else {

            //Otherwise, send the acceptance test data
            res.send({acceptanceTest: acceptanceTest});
        }
    })
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

exports.updateAcceptanceTest = function(req, res) {
    
    //Get the acceptance test data from the request
    var acceptanceTestData = req.body;

    //Get the existing acceptance test and update it
    AcceptanceTest.findOneAndUpdate({code: acceptanceTestData.code, projectCode: acceptanceTestData.projectCode, featureCode: acceptanceTestData.featureCode}, releaseData, function(error, acceptanceTest) {
        
        //If an error occurred
        if(error) {

            //Set the error status
            res.status(400);

            //Send the error message
            return res.send({reason: error.toString()});
        }
        else {

            //Set the success status
            res.status(200);

            //Send the updated acceptance test
            res.send(acceptanceTest);
        }
    });
};
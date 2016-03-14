var mongoose = require('mongoose'),
    quoteModel = require('../models/Quote'),
    featureModel = require('../models/Feature'),
    releaseModel = require('../models/Release'),
    voteModel = require('../models/Vote'),
    projectModel = require('../models/Project'),
    testStepModel = require('../models/TestStep')

module.exports = function(config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('hackathon db opened');
    });
    
    quoteModel.createInitialQuotes();
    featureModel.createInitialFeatures();   
    testStepModel.createInitialTestSteps();
}
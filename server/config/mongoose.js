var mongoose = require('mongoose'),
    quoteModel = require('../models/Quote'),
    voteModel = require('../models/Vote'),
    userStoryModel = require('../models/UserStory')
    featureModel = require('../models/Feature'),
    releaseModel = require('../models/Release'),
    voteModel = require('../models/Vote'),
    projectModel = require('../models/Project'),
    testStepModel = require('../models/TestStep');
    projectModel = require('../models/Project')

module.exports = function(config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('hackathon db opened');
    });
    
    quoteModel.createInitialQuotes();
    userStoryModel.createInitialUserStory();
    featureModel.createInitialFeatures();  
    testStepModel.createInitialTestSteps();
    projectModel.createInitialProject();
}
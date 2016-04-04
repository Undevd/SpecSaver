var mongoose = require('mongoose'),
    acceptanceTestModel = require('../models/AcceptanceTest'),
    quoteModel = require('../models/Quote'),
    voteModel = require('../models/Vote'),
    featureModel = require('../models/Feature'),
    releaseModel = require('../models/Release'),
    voteModel = require('../models/Vote'),
    testModel = require('../models/Test'),
    projectModel = require('../models/Project'),
    testStepModel = require('../models/TestStep'),
    userModel = require('../models/User'),
    userStoryModel = require('../models/UserStory');
    
module.exports = function(config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('hackathon db opened');
    });
}
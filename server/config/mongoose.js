var mongoose = require('mongoose'),
    acceptanceTestModel = require('../models/AcceptanceTest'),
    featureModel = require('../models/Feature'),
    projectModel = require('../models/Project'),
    quoteModel = require('../models/Quote'),
    releaseModel = require('../models/Release'),
    systemTestModel = require('../models/SystemTest'),
    testStepModel = require('../models/TestStep'),
    userModel = require('../models/User'),
    userStoryModel = require('../models/UserStory'),
    voteModel = require('../models/Vote');
    
module.exports = function(config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('hackathon db opened');
    });
}
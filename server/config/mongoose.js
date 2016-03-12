var mongoose = require('mongoose'),
    quoteModel = require('../models/Quote')

module.exports = function(config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('hackathon db opened');
    });
    
    quoteModel.createInitialQuotes();    
}
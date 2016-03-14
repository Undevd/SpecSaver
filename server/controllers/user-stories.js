var UserStory = require('mongoose').model('UserStory');

exports.getUserStories = function(req, res) {
    UserStory.find({}).exec(function(err, collection) {
        res.send(collection);
    })
};


exports.createUserStory = function(req, res, next) {
    var userStoryData = req.body;
    UserStory.create(userStoryData, function(err, vote) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.sendStatus(400);
            return res.send({reason:err.toString()});
        }
        res.sendStatus(201);
    });
}
var UserStory = require('mongoose').model('UserStory');

exports.getUserStories = function(req, res) {
    UserStory.find({}).exec(function(err, userStories) {
        res.send(userStories);
    })
};

exports.createUserStory = function(req, res) {
    var userStoryData = req.body;
    UserStory.create(userStoryData, function(err, userStory) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(201);
        res.send(userStory);
    });
}
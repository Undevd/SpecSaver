var UserStory = require('mongoose').model('UserStory');

exports.createUserStory = function(req, res) {
    var userStoryData = req.body;

    //Get the latest user story assigned to the feature in the project
    userStoryData.code = UserStory.findOne({projectCode: req.params.projectCode, featureCode: req.params.featureCode}).sort('-code').exec(function(err, latestUserStory) {
        
        //Assign a new code to the user story, starting from 1 if none exists
        userStoryData.code = (latestUserStory == null? 1 : latestUserStory.code + 1);

        //Create the user story
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
    })
};

exports.getAllUserStories = function(req, res) {
    UserStory.find({projectCode: req.params.projectCode, featureCode: req.params.featureCode}).sort('code').exec(function(err, userStories) {
        res.send(userStories);
    })
};

exports.getUserStory = function(req, res) {
    UserStory.findOne({code: req.params.userStoryCode, projectCode: req.params.projectCode, featureCode: req.params.featureCode}).exec(function(err, userStory) {
        res.send(userStory);
    })
};

exports.getUserStoryCountForFeature = function(req, res) {
    UserStory.count({projectCode: req.params.projectCode, featureCode: req.params.featureCode}).exec(function(err, count) {
        res.send({count: count});
    });
};

exports.getUserStoryCountForProject = function(req, res) {
    UserStory.count({projectCode: req.params.projectCode}).exec(function(err, count) {
        res.send({count: count});
    });
};

exports.getUserStoryCountGroupedByFeature = function(req, res) {;
    UserStory.aggregate([{$match: {projectCode: req.params.projectCode}}, {$group: {_id: "$featureCode", total: {$sum: 1}}}]).sort('_id').exec(function(err, result) {
        res.send(result);
    });
};

exports.updateUserStory = function(req, res) {
    var userStoryData = req.body;
    UserStory.findOneAndUpdate({code: userStoryData.code, projectCode: userStoryData.projectCode, featureCode: req.params.featureCode}, userStoryData, function(err, userStory) {
        if(err) {
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(200);
        res.send(userStory);
    });
};
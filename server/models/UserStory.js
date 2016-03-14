var mongoose = require('mongoose');

var userStorySchema = mongoose.Schema({
    name: {type:String, required:"{PATH} is required"},
    story: {type:String, required:"{PATH} is required"}
});

var UserStory = mongoose.model('UserStory', userStorySchema);

function createInitialUserStory() {
    UserStory.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            UserStory.create({name: 'Jack and the beanstalk', story: 'As Jack, I want to climb the beanstalk, so that I can steal the golden eggs'});
        }
    });
}

exports.createInitialUserStory = createInitialUserStory;
var mongoose = require('mongoose');

var userStorySchema = mongoose.Schema({
    asA: {type:String, required:'{PATH} is required'},
    iCan: {type:String, required:'{PATH} is required'},
    soThat: {type:String, required:'{PATH} is required'},
    code: {type: String, required: '{PATH} is required', unique: true},
    projectCode: {type:String, required: '{PATH} is required'},
    featureCode: {type:String, required: '{PATH} is required'}
});

userStorySchema.methods = { };

var UserStory = mongoose.model('UserStory', userStorySchema);
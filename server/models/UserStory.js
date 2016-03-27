var mongoose = require('mongoose');

var userStorySchema = mongoose.Schema({
    asA: {type:String, required:'{PATH} is required'},
    iCan: {type:String, required:'{PATH} is required'},
    soThat: {type:String, required:'{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    projectCode: {type:String, required: '{PATH} is required'},
    featureCode: {type:String, required: '{PATH} is required'}
});

userStorySchema.index({code: 1, projectCode: 1, featureCode: 1}, {unique: true});

userStorySchema.methods = { };

var UserStory = mongoose.model('UserStory', userStorySchema);
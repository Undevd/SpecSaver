var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
    voter: { type:String, required:'{PATH} is required'},
    project: {type:String, required:'{PATH} is required'},
    concept: { type:Number, required:'{PATH} is required'},
    implementation: { type:Number, required:'{PATH} is required'},
    presentation: { type:Number, required:'{PATH} is required'},
});

voteSchema.index({voter: 1, project: 1}, {unqiue: true});

voteSchema.methods = { };

var Vote = mongoose.model('Vote', voteSchema);
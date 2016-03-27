var mongoose = require('mongoose');

var releaseSchema = mongoose.Schema({
    name: { type:String, required:'{PATH} is required'},
    code: {type: String, required: '{PATH} is required'},
    description: {type:String},
    projectCode: {type:String, required: '{PATH} is required'}
});

releaseSchema.index({code: 1, projectCode: 1}, {unique: true});

releaseSchema.methods = { };

var Release = mongoose.model('Release', releaseSchema);
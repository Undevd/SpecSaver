var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    project: {type:String, required:'{PATH} is required'},
    description: {type:String, required:'{PATH} is required'}
});

projectSchema.methods = { };

var project = mongoose.model('Project', projectSchema);
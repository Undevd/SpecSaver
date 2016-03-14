var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    project: {type:String, required:'{PATH} is required'},
    description: {type:String, required:'{PATH} is required'}
});

projectSchema.methods = { };

var Project = mongoose.model('Project', projectSchema);

function createInitialProject() {
    Project.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Project.create({project: "SpecSaver", description: " SpecSaver project description"});
        }
    });
}

exports.createInitialProject = createInitialProject;
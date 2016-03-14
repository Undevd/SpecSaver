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
            Project.create({project: "SpecSaver", description: "Testing tool."});
            Project.create({project: "Contact360", description: "Customer contact platform."});
            Project.create({project: "NIROS", description: "Backend processing for registering all life events."});
        }
    });
}

exports.createInitialProject = createInitialProject;
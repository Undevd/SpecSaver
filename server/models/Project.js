var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    name: {type: String, required:'{PATH} is required'},
    code: {type: String, required: '{PATH} is required', unique: true},
    description: {type: String}
});

projectSchema.methods = { };

var Project = mongoose.model('Project', projectSchema);

function createInitialProject() {
    Project.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Project.create({name: "SpecSaver", code: "SpecSaver", description: "Testing tool."});
            Project.create({name: "Contact360", code: "C360", description: "Customer contact platform."});
            Project.create({name: "NIROS", code: "NIROS", description: "Backend processing for registering all life events."});
        }
    });
}

exports.createInitialProject = createInitialProject;
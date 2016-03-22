var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    name: {type: String, required:'{PATH} is required'},
    code: {type: String, required: '{PATH} is required', unique: true},
    description: {type: String},
	admins: {type: [String]},
    members: {type: [String]}
});

projectSchema.methods = { };

var Project = mongoose.model('Project', projectSchema);

function createInitialProject() {
    Project.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Project.create({name: "SpecSaver", code: "SpecSaver", description: "Testing tool.", members: ["Zeroish", "Batman"]});
            Project.create({name: "Contact360", code: "C360", description: "Customer contact platform.", members: ["Superman", "Batman"]});
            Project.create({name: "NIROS", code: "NIROS", description: "Backend processing for registering all life events.", members: ["Zeroish", "IronMan", "TheCaptain"]});
        }
    });
}

exports.createInitialProject = createInitialProject;
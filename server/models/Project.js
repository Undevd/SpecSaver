var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    name: {type:String, required:'{PATH} is required'},
    description: {type:String, required:'{PATH} is required'},
    admins: {type: [String]},
    members: {type: [String]}
});

projectSchema.methods = { };

var Project = mongoose.model('Project', projectSchema);

function createInitialProject() {
    Project.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Project.create({name: "SpecSaver", description: "Testing tool.", members: ["Zeroish", "Batman"]});
            Project.create({name: "Contact360", description: "Customer contact platform.", members: ["Superman", "Batman"]});
            Project.create({name: "NIROS", description: "Backend processing for registering all life events.", members: ["Zeroish", "IronMan", "TheCaptain"]});
        }
    });
}

exports.createInitialProject = createInitialProject;
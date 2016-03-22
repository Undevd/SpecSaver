var mongoose = require('mongoose');

var releaseSchema = mongoose.Schema({
    name: { type:String, required:'{PATH} is required'},
    description: {type:String, required:'{PATH} is required'},
    projectCode: {type:String, required: '{PATH} is required'}
});

releaseSchema.methods = { };

var Release = mongoose.model('Release', releaseSchema);

function createInitialReleases() {
    Release.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Release.create({name: "5.1", release: "Release 5.1 description", projectCode: ""});
        }
    });
}

exports.createInitialReleases = createInitialReleases;
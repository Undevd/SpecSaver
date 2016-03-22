var mongoose = require('mongoose');

var featureSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required'},
    code: {type: String, required: '{PATH} is required', unique: true},
    description: {type:String},
    projectCode: {type:String, required: '{PATH} is required'}
});

featureSchema.methods = { };

var Feature = mongoose.model('Feature', featureSchema);

function createInitialFeatures() {
    Feature.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Feature.create({name: 'Add to queue control', description: 'Queue Management Processes for Service Requests'});
            Feature.create({name: 'Adding a language', description: 'Introducing multi-lingual Customer Portal.'});
            Feature.create({name: 'Multiple bookings', description: 'Introducing multiple bookings for Pest Control.'});
        }
    });
}

exports.createInitialFeatures = createInitialFeatures;
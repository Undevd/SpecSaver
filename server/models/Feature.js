var mongoose = require('mongoose');

var featureSchema = mongoose.Schema({
    name: { type:String, required:'{PATH} is required'},
    description: { type:String, required:'{PATH} is required'}
});

featureSchema.methods = { };

var Feature = mongoose.model('Feature', featureSchema);

function createInitialFeatures() {
    Feature.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Feature.create({name: 'Add to queue control', description: 'Describing adding to the queue.'});
            Feature.create({name: 'Adding a language', description: 'Describing adding a language.'});
            Feature.create({name: 'Multiple bookings', description: 'Describing multiple bookings.'});
            Feature.create({name: 'Feature test 1.', description: 'Describing adding a feature.'});
            Feature.create({name: 'Feature test 2.', description: 'Describing adding a feature.'});
            Feature.create({name: 'Feature test 3.', description: 'Describing adding a feature.'});
            Feature.create({name: 'Feature test 4.', description: 'Describing adding a feature.'});
        }
    });
}

exports.createInitialFeatures = createInitialFeatures;
var mongoose = require('mongoose');

var featureSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required'},
    code: {type: String, required: '{PATH} is required'},
    description: {type:String},
    projectCode: {type:String, required: '{PATH} is required'}
});

featureSchema.index({code: 1, projectCode: 1}, {unique: true});

featureSchema.methods = { };

var Feature = mongoose.model('Feature', featureSchema);
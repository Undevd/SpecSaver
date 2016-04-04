var mongoose = require('mongoose');

var acceptanceTestSchema = mongoose.Schema({
    given: {type: String, required: '{PATH} is required'},
    when: {type: String, required: '{PATH} is required'},
    then: {type: String, required: '{PATH} is required'},
    code: {type: Number, required: '{PATH} is required'},
    projectCode: {type: String, required: '{PATH} is required'},
    featureCode: {type: String, required: '{PATH} is required'}
});

acceptanceTestSchema.index({code: 1, projectCode: 1, featureCode: 1}, {unique: true});

acceptanceTestSchema.methods = { };

var AcceptanceTest = mongoose.model('AcceptanceTest', acceptanceTestSchema);
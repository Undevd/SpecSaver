var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
    name: {type:String, required:'{PATH} is required'},
    description: {type:String, required:'{PATH} is required'}
});

testSchema.methods = { };

var Test = mongoose.model('Test', testSchema);
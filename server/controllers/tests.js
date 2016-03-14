var Test = require('mongoose').model('Test');

exports.getTests = function(req, res) {
    Test.find({}).exec(function(err, collection) {
        console.log(collection);
        res.send(collection);
    })
};

exports.createTest = function(req, res, next) {
    var testData = req.body;
    Test.create(testData, function(err, quote) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }
        res.status(201);
    });
}
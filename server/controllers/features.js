var Feature = require('mongoose').model('Feature');

exports.getFeatures = function(req, res) {
    Feature.find({}).exec(function(err, collection) {
        console.log(collection);
        res.send(collection);
    })
};

exports.getSingleFeature = function(req, res, featureId){
    Feature.find({_id: featureId}).exec(function (err, collection) {
        console.log(collection);
        res.send(collection)
    })
}

exports.createFeature = function(req, res, next) {
    var featureData = req.body;
    Feature.create(featureData, function(err, feature) {
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
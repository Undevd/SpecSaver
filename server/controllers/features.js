var Feature = require('mongoose').model('Feature');

exports.createFeature = function(req, res) {
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
        res.send(feature);
    });
};

exports.getAllFeatures = function(req, res) {
    Feature.find({ projectCode: req.params.projectCode, releaseCode: req.params.releaseCode }).sort('name').exec(function(err, features) {
        res.send(features);
    })
};

exports.getFeature = function(req, res){
    Feature.find({_id: featureId}).exec(function (err, feature) {
        res.send(feature)
    })
};
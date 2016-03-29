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

exports.getAllFeaturesByProject = function(req, res) {
    Feature.find({projectCode: req.params.projectCode, releaseCode: req.params.releaseCode}).sort('name').exec(function(err, features) {
        res.send(features);
    });
};

exports.getAllFeaturesByRelease = function(req, res) {
    res.send([{}]);
};

exports.getFeature = function(req, res){
    Feature.findOne({code: req.params.featureCode, projectCode: req.params.projectCode}).exec(function(err, feature) {
        res.send(feature)
    });
};

exports.getFeatureCountByProject = function(req, res) {
    Feature.count({projectCode: req.params.projectCode}).exec(function(err, count) {
        res.send({count: count});
    });
};

exports.getFeatureCountByRelease = function(req, res) {
    res.send({count: "TBC"});
};

exports.updateFeature = function(req, res) {
    var featureData = req.body;
    Feature.findOneAndUpdate({code: featureData.code, projectCode: featureData.projectCode}, featureData, function(err, feature) {
        if(err) {
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(200);
        res.send(feature);
    });
};
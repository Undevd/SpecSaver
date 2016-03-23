var Release = require('mongoose').model('Release');

exports.createRelease = function(req, res) {
    var releaseData = req.body;
    Release.create(releaseData, function(err, release) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(201);
        res.send(release);
    });
};

exports.getAllReleases = function(req, res) {
    Release.find({ projectCode: req.params.projectCode }).sort('name').exec(function(err, releases) {
        res.send(releases);
    })
};

exports.getAllReleasesCount = function(req, res) {
    Release.count({ projectCode: req.params.projectCode }).exec(function(err, count) {
        res.send({count: count});
    })
};

exports.getRelease = function(req, res) {
    Release.findOne({ code: req.params.releaseCode, projectCode: req.params.projectCode }).exec(function(err, release) {
        res.send(release);
    })
};

exports.updateRelease = function(req, res) {
    var releaseData = req.body;
    Release.findOneAndUpdate({code: releaseData.code, projectCode: releaseData.projectCode}, releaseData, function(err, release) {
        if(err) {
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(200);
        res.send(release);
    });
};
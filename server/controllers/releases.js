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
    Release.find({ projectId: req.params.projectId }).exec(function(err, releases) {
        res.send(releases);
    })
};

exports.getRelease = function(req, res) {
    Release.findOne({ _id: req.params.releaseId, projectId: req.params.projectId }).exec(function(err, release) {
        res.send(release);
    })
}
var Release = require('mongoose').model('Release');

exports.getReleases = function(req, res) {
    Release.find({}).exec(function(err, collection) {
        console.log(collection);
        res.send(collection);
    })
};

exports.createRelease = function(req, res, next) {
    var releaseData = req.body;
    Release.create(releaseData, function(err, quote) {
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
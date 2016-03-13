var Vote = require('mongoose').model('Vote');

exports.createVote = function(req, res, next) {
    var voteData = req.body;
    Vote.create(voteData, function(err, vote) {
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
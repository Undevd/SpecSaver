var Vote = require('mongoose').model('Vote');

exports.getVotes = function(req, res) {
    Vote.find({}).exec(function(err, votes) {
        res.send(votes);
    })
};

exports.createVote = function(req, res) {
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
        res.send(vote);
    });
}
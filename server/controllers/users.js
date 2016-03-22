var User = require('mongoose').model('User');

exports.getUsers = function(req, res) {
    User.find({}).select('username').exec(function(err, users) {
        res.send(users);
    })
};
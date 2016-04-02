var User = require('mongoose').model('User');

exports.getUsers = function(req, res) {
    User.find({}, 'username firstname lastname').exec(function(err, users) {
        res.send(users);
    })
};
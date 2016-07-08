var mongoose = require('mongoose'),
    crypto = require('crypto');

var userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    salt: String,
    hashed_pwd: String
});

userSchema.methods = {
    authenticate: function(pwdToMatch) {
        return hashPassword(this.salt, pwdToMatch) === this.hashed_pwd;
    }
}

var User = mongoose.model('User', userSchema);

exports.createInitialUsers = function createInitialUsers() {
    User.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            var salt, hash;
            salt = generateSalt();
            hash = hashPassword(salt, 'Zeroish');
            User.create({firstname:'Scott', lastname:'Hulme', username:'Zeroish', salt: salt, hashed_pwd: hash});
            salt = generateSalt();
            hash = hashPassword(salt, 'TheCaptain');
            User.create({firstname:'Steven', lastname:'Rogers', username:'TheCaptain', salt: salt, hashed_pwd: hash});
            salt = generateSalt();
            hash = hashPassword(salt, 'IronMan');
            User.create({firstname:'Tony', lastname:'Stark', username:'IronMan', salt: salt, hashed_pwd: hash});
            salt = generateSalt();
            hash = hashPassword(salt, 'Superman');
            User.create({firstname:'Clark', lastname:'Kent', username:'Superman', salt: salt, hashed_pwd: hash});
            salt = generateSalt();
            hash = hashPassword(salt, 'Batman');
            User.create({firstname:'Bruce', lastname:'Wayne', username:'Batman', salt: salt, hashed_pwd: hash});
        }
    });
}

function generateSalt() {
    return crypto.randomBytes(128).toString('base64');
}

function hashPassword(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    hmac.setEncoding('hex');
    hmac.write(pwd);
    hmac.end();
    return hmac.read();
}
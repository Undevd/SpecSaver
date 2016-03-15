var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String
});

var User = mongoose.model('User', userSchema);

User.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
        User.create({firstname:'Scott', lastname:'Hulme', username:'Zeroish'});
        User.create({firstname:'Steven', lastname:'Rogers', username:'TheCaptain'});
        User.create({firstname:'Tony', lastname:'Stark', username:'IronMan'});
        User.create({firstname:'Clark', lastname:'Kent', username:'Superman'});
        User.create({firstname:'Bruce', lastname:'Wayne', username:'Batman'});
    }
});
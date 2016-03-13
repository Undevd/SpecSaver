var mongoose = require('mongoose');

var quoteSchema = mongoose.Schema({
    quote: { type:String, required:'{PATH} is required'},
    person: {type:String, required:'{PATH} is required'}
});

quoteSchema.methods = { };

var Quote = mongoose.model('Quote', quoteSchema);

function createInitialQuotes() {
    Quote.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            Quote.Create({quote: 'Me fail english? Thats unpossible', person: 'Ralph Wiggum'});
            Quote.Create({quote: 'Robots dont say ye', person: 'Hermes Conrad'});
            Quote.Create({quote: 'Two oil changes for the price of one! Now if I could afford the one, and the car.', person: 'Dr John Zoidberg'});
            Quote.Create({quote: 'You there! Cut my milk.', person: 'Stewie Griffin'});
            Quote.Create({quote: 'You tried your best and you failed miserably. The lesson is: Never try', person: 'Homer Simpson'});
            Quote.Create({quote: 'If we can hit that bullseye the rest of the dominoes will fall like a house of cards. checkmate', person: 'Zapp Brannigan'});
            Quote.Create({quote: 'I hate Mondays', person: 'Garfield'});
        }
    });
}

exports.createInitialQuotes = createInitialQuotes;
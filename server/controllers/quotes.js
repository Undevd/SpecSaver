var Quote = require('mongoose').model('Quote');

exports.getQuotes = function(req, res) {
    Quote.find({}).exec(function(err, quotes) {
        res.send(quotes);
    })
};

exports.createQuote = function(req, res) {
    var quoteData = req.body;
    Quote.create(quoteData, function(err, quote) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('A duplicate exists');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }

        res.status(201);
        res.send(quote);
    });
}
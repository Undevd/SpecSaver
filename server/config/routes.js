var quotes = require('../controllers/quotes'),
    votes = require('../controllers/votes');

module.exports = function(app) {
    
    // Quote Routes
    app.get('/api/quotes', quotes.getQuotes);
    app.post('/api/quotes', quotes.createQuote);
    
    
    app.post('/api/votes', votes.createVote);
    app.get('/api/votes', votes.getVotes);
    
    app.get('/partials/*', function(req, res) {
        console.log(req.params);
        res.render('../../public/app/' + req.params[0]);
    });

    app.all('/api/*', function(req, res) {
        res.send(404);
    });

    app.get('*', function(req, res) {
        res.render('index');
    });
}
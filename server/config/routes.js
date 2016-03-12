var quotes = require('../controllers/quotes');

module.exports = function(app) {
    
    app.post('/api/quotes', quotes.createQuote);
    
    app.get('/partials/*', function(req, res) {
        console.log(req.params);
        res.render('../../public/app/' + req.params[0]);
    });

    app.get('*', function(req, res) {
        res.render('index');
    });
}
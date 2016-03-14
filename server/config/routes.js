var quotes = require('../controllers/quotes'),
    features = require('../controllers/features'),
    releases = require('../controllers/releases'),
    votes = require('../controllers/votes'),
    projects = require('../controllers/projects'),
    tests = require('../controllers/tests');
module.exports = function(app) {
    
    // Quote Routes
    app.get('/api/quotes', quotes.getQuotes);
    app.post('/api/quotes', quotes.createQuote);

    app.get('/api/features', features.getFeatures);
    app.post('/api/features', features.createFeature);

    app.get('/api/releases', releases.getReleases);
    app.post('/api/releases', releases.createRelease);
    
    app.get('/api/tests', tests.getTests);
    app.post('/api/tests', tests.createTest);   
    
    app.post('/api/votes', votes.createVote);
    app.get('/api/votes', votes.getVotes);

    app.post('api/projects', projects.createProject);
    app.get('api/projects', projects.getProject);
    
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
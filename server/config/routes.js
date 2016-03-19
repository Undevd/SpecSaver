var auth = require('./auth'),
    features = require('../controllers/features'),
    projects = require('../controllers/projects'),
    quotes = require('../controllers/quotes'),
    releases = require('../controllers/releases'),
    tests = require('../controllers/tests'),
    testSteps = require('../controllers/testSteps'),
    userStories = require('../controllers/user-stories'),
    votes = require('../controllers/votes');

module.exports = function(app) {
   
    // Authenticate
    app.post('/login', auth.authenticate);
    app.post('/logout', function(req, res) {
        req.logout();
        res.end();
    });
    
    // Feature routes
    app.get('/api/features', features.getFeatures);
    app.post('/api/features', features.createFeature);
    app.get('/api/features/:featureId', features.getSingleFeature);

    // Project routes
    app.get('/api/projects/:projectId', projects.getProject);
    app.get('/api/projects', projects.getAllProjects);
    app.post('/api/projects', projects.createProject);

    // Quote routes
    app.get('/api/quotes', quotes.getQuotes);
    app.post('/api/quotes', quotes.createQuote);

    // Release routes
    app.get('/api/releases/query/:projectId', releases.getAllReleases);
    app.get('/api/releases/querycount/:projectId', releases.getAllReleasesCount);
    app.get('/api/releases/queryone/:projectId/:releaseId', releases.getRelease);
    app.post('/api/releases/:projectId', releases.createRelease);

    // Test routes
    app.get('/api/tests', tests.getTests);
    app.post('/api/tests', tests.createTest);   
    
    // Test Step routes
    app.get('/api/testSteps', testSteps.getTestSteps);
    app.post('/api/testSteps', testSteps.createTestStep);

    // User Story routes
    app.post('/api/user-stories', userStories.createUserStory);
    app.get('/api/user-stories', userStories.getUserStories);

    // Vote routes
    app.post('/api/votes', votes.createVote);
    app.get('/api/votes', votes.getVotes);

    //Default routes
    app.get('/partials/*', function(req, res) {
        console.log(req.params);
        res.render('../../public/app/' + req.params[0]);
    });

    app.all('/api/*', function(req, res) {
        res.sendStatus(404);
    });

    app.get('*', function(req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
}
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
    app.get('/api/features/query/:projectCode/:releaseId', features.getAllFeatures);
    app.get('/api/features/query/:projectCode', features.getAllFeatures);
    app.post('/api/features/:projectCode', features.createFeature);

    // Project routes
    app.get('/api/projects/:projectCode', projects.getProject);
    app.get('/api/projects', projects.getAllProjects);
    app.post('/api/projects', projects.createProject);
    app.put('/api/projects', projects.updateProject);

    // Quote routes
    app.get('/api/quotes', quotes.getQuotes);
    app.post('/api/quotes', quotes.createQuote);

    // Release routes
    app.get('/api/releases/query/:projectCode', releases.getAllReleases);
    app.get('/api/releases/querycount/:projectCode', releases.getAllReleasesCount);
    app.get('/api/releases/queryone/:projectCode/:releaseId', releases.getRelease);
    app.post('/api/releases/:projectCode', releases.createRelease);
    app.put('/api/releases/update', releases.updateRelease);

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
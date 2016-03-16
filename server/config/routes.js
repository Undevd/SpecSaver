var quotes = require('../controllers/quotes'),
    features = require('../controllers/features'),
    releases = require('../controllers/releases'),
    votes = require('../controllers/votes'),
    projects = require('../controllers/projects'),
    tests = require('../controllers/tests'),
    testSteps = require('../controllers/testSteps'),
    userStories = require('../controllers/user-stories'),
    auth = require('./auth');

module.exports = function(app) {
   
   // Authenticate
    app.post('/login', auth.authenticate);
   
    // User Story Routes
    app.post('/api/user-stories', userStories.createUserStory);
    app.get('/api/user-stories', userStories.getUserStories);
    
    // Quote Routes
    app.get('/api/quotes', quotes.getQuotes);
    app.post('/api/quotes', quotes.createQuote);
    
    // Features Routes
    app.get('/api/features', features.getFeatures);
    app.post('/api/features', features.createFeature);
    app.get('/api/features/:featureId', features.getSingleFeature);
    
    // Test Step Routes
    app.get('/api/testSteps', testSteps.getTestSteps);
    app.post('/api/testSteps', testSteps.createTestStep);
    
    // Release Routes
    app.get('/api/releases', releases.getReleases);
    app.post('/api/releases', releases.createRelease);

    // Test Routes
    app.get('/api/tests', tests.getTests);
    app.post('/api/tests', tests.createTest);   
    
    // Vote Routes
    app.post('/api/votes', votes.createVote);
    app.get('/api/votes', votes.getVotes);

    // Project Routes
    app.post('/api/projects', projects.createProject);
    app.get('/api/projects/:projectId', function(req, res)
    {
        return projects.getProject(req.params)
    });
    app.get('/api/projects', projects.getAllProjects);
    
    app.get('/partials/*', function(req, res) {
        console.log(req.params);
        res.render('../../public/app/' + req.params[0]);
    });

    app.all('/api/*', function(req, res) {
        res.sendStatus(404);
    });

    app.get('*', function(req, res) {
        res.render('index');
    });
}
var auth = require('./auth'),
    acceptanceTests = require('../controllers/acceptance-tests'),
    features = require('../controllers/features'),
    projects = require('../controllers/projects'),
    quotes = require('../controllers/quotes'),
    releases = require('../controllers/releases'),
    systemTests = require('../controllers/system-tests'),
    testSteps = require('../controllers/testSteps'),
    users = require('../controllers/users'),
    userStories = require('../controllers/user-stories'),
    votes = require('../controllers/votes');

module.exports = function(app) {
   
    // Authenticate
    app.post('/login', auth.authenticate);
    app.post('/logout', function(req, res) {
        req.logout();
        res.end();
    });
    
    // Acceptance Test routes
    app.get('/api/acceptance-tests/all/:projectCode/:featureCode', acceptanceTests.getAllAcceptanceTests);
    app.get('/api/acceptance-tests/one/:projectCode/:featureCode/:acceptanceTestCode', acceptanceTests.getAcceptanceTest);
    app.post('/api/acceptance-tests/*', acceptanceTests.createAcceptanceTest);
    app.put('/api/acceptance-tests/*', acceptanceTests.updateAcceptanceTest);

    // Feature routes
    app.get('/api/features/all/:projectCode/:releaseCode', features.getAllFeaturesByRelease);
    app.get('/api/features/all/:projectCode', features.getAllFeaturesByProject);
    app.get('/api/features/one/:projectCode/:featureCode', features.getFeature);
    app.post('/api/features/*', features.createFeature);
    app.put('/api/features/*', features.updateFeature);

    // Project routes
    app.get('/api/projects/all', projects.getAllProjects);
    app.get('/api/projects/one/:projectCode', projects.getProject);
    app.post('/api/projects', projects.createProject);
    app.put('/api/projects', projects.updateProject);

    // Quote routes
    app.get('/api/quotes', quotes.getQuotes);
    app.post('/api/quotes', quotes.createQuote);

    // Release routes
    app.get('/api/releases/all/:projectCode', releases.getAllReleasesByProject);
    app.get('/api/releases/one/:projectCode/:releaseCode', releases.getRelease);
    app.post('/api/releases/*', releases.createRelease);
    app.put('/api/releases/*', releases.updateRelease);

    // System Test routes
    app.get('/api/system-tests/all/:projectCode', systemTests.getAllSystemTestsByProject);
    app.get('/api/system-tests/one/:projectCode/:releaseCode', systemTests.getSystemTest);
    app.post('/api/system-tests/*', systemTests.createSystemTest);
    app.put('/api/system-tests/*', systemTests.updateSystemTest);
    
    // Test Step routes
    app.get('/api/testSteps', testSteps.getTestSteps);
    app.post('/api/testSteps', testSteps.createTestStep);
    
    // User routes
    app.get('/api/users', users.getUsers);
    
    // User Story routes
    app.get('/api/user-stories/all/:projectCode/:featureCode', userStories.getAllUserStories);
    app.get('/api/user-stories/one/:projectCode/:featureCode/:userStoryCode', userStories.getUserStory);
    app.post('/api/user-stories/*', userStories.createUserStory);
    app.put('/api/user-stories/*', userStories.updateUserStory);

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
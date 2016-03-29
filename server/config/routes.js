var auth = require('./auth'),
    features = require('../controllers/features'),
    projects = require('../controllers/projects'),
    quotes = require('../controllers/quotes'),
    releases = require('../controllers/releases'),
    tests = require('../controllers/tests'),
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
    
    // Feature routes
    app.get('/api/features/count/for/:projectCode/:releaseCode', features.getFeatureCountByRelease);
    app.get('/api/features/count/for/:projectCode', features.getFeatureCountByProject);
    app.get('/api/features/get/all/:projectCode/:releaseCode', features.getAllFeaturesByRelease);
    app.get('/api/features/get/all/:projectCode', features.getAllFeaturesByProject);
    app.get('/api/features/get/one/:projectCode/:featureCode', features.getFeature);
    app.post('/api/features/*', features.createFeature);
    app.put('/api/features/*', features.updateFeature);

    // Project routes
    app.get('/api/projects/:projectCode', projects.getProject);
    app.get('/api/projects', projects.getAllProjects);
    app.post('/api/projects', projects.createProject);
    app.put('/api/projects', projects.updateProject);

    // Quote routes
    app.get('/api/quotes', quotes.getQuotes);
    app.post('/api/quotes', quotes.createQuote);

    // Release routes
    app.get('/api/releases/count/for/:projectCode', releases.getReleaseCountForProject);
    app.get('/api/releases/get/all/:projectCode', releases.getAllReleases);
    app.get('/api/releases/get/one/:projectCode/:releaseCode', releases.getRelease);
    app.post('/api/releases/*', releases.createRelease);
    app.put('/api/releases/*', releases.updateRelease);

    // Test routes
    app.get('/api/tests', tests.getTests);
    app.post('/api/tests', tests.createTest);   
    
    // Test Step routes
    app.get('/api/testSteps', testSteps.getTestSteps);
    app.post('/api/testSteps', testSteps.createTestStep);
    
    // User routes
    app.get('/api/users', users.getUsers);
    
    // User Story routes
    app.get('/api/user-stories/count/for/:projectCode/:featureCode', userStories.getUserStoryCountForFeature);
    app.get('/api/user-stories/count/for/:projectCode', userStories.getUserStoryCountForProject);
    app.get('/api/user-stories/count/grouped/:projectCode', userStories.getUserStoryCountGroupedByFeature);
    app.get('/api/user-stories/get/all/:projectCode/:featureCode', userStories.getAllUserStories);
    app.get('/api/user-stories/get/one/:projectCode/:featureCode/:userStoryCode', userStories.getUserStory);
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
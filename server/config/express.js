var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    stylus = require('stylus'),
    cookieParser = require('cookie-parser')
    session = require('express-session'),
    passport = require('passport');

module.exports = function(app, config) {
    function compile(str, path) {
        return stylus(str).set('filename', path);
    }

    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'pug');
    app.use(logger('dev'));
    
    // Required for sessions
    app.use(cookieParser());
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json({limit: '500kb'}));
    
    app.use(session({secret: 'hackathon 2016 specsaver', resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(stylus.middleware(
        {
            src: config.rootPath + '/public',
            compile: compile
        }
    ));

    app.use(express.static(config.rootPath + '/public'));
}

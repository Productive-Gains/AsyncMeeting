var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../../config');
var User = require('../../server/models/user');
var logger = require('../utils/logger');

router.use(express.static(__dirname + '/../../assets'));

/* Handle Login POST */
router.post('/login',
    passport.authenticate('login'),
    function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        var token = jwt.encode({username: req.user.username}, config.secret);
        User.findPublicUserById(req.user._id).then(function(user) {
            res.json({user:user, token: token, permissions:['CanReadMeetingAreas', 'CanCreateMeetingAreas', 'CanViewMeetingAreas', 'CanDeleteMeetingAreas']});  // TODO test permissions need to be removed after permissions are fixed
        });
    }
);

router.post('/email-login',
    passport.authenticate('email-login'),
    function(req, res) {
        //console.log("in email-logi POST");
        logger.debug("in email-logi POST");
        res.setHeader('Content-Type', 'application/json');
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        var token = jwt.encode({username: req.user.username}, config.secret);
        User.findPublicUserById(req.user._id).then(function(user) {
            logger.debug("Sending response");
            res.json({user:user, token: token, permissions:['CanReadMeetingAreas', 'CanCreateMeetingAreas', 'CanViewMeetingAreas', 'CanDeleteMeetingAreas']});  // TODO test permissions need to be removed after permissions are fixed
        });
    }
);

/* Handle Registration POST */
router.post('/signup',
    passport.authenticate('signup'),
    function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var un = req.user.username;
        var user = User.findPublicUserByUserName(req.user.username).then (function(user){
            logger.debug('Found user by name during register = ' + user);
            res.json(user);  // TODO user is missing roles and permissions need to fix in passport signup code
        });
    }
);

module.exports = router;


/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var express = require('express');
var router = express.Router();
var authUtil = require('../src/authutils');
var moment = require('moment');
var logHelper = require('../src/logHelper');

var log = logHelper.createLogger();

/* GET home page. */
router.get('/', authUtil.ensureAuthenticated, function(req, res) {
    var lastSeen;

    log.debug('Cookies ' + JSON.stringify(req.cookies));
  
    const cookieOptions = {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: "lax",
        path: "/userinfo"
    };

    //Extracting and showing last time visited in cookie
    if (req.signedCookies.sMailandStuff_lasttimeseen_userinfo) {
        lastSeen = req.signedCookies.sMailandStuff_lasttimeseen_userinfo;
    }

    //Setting last time visited for user info page
    var nowD = moment().utc().format('LLLL');
    res.cookie('sMailandStuff_lasttimeseen_userinfo',nowD, cookieOptions); 

    // Preparing username and expire date/time for access token
    const tokenExpireDate = moment(req.user.authInfo.access_token_exp * 1000).format('MMMM Do YYYY, h:mm:ss a');

    res.render('userinfo', { title: 'User and session Information', user: req.user, tokenExpDate: tokenExpireDate, lastSeen:lastSeen });
});

module.exports = router;

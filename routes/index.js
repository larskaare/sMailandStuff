var express = require('express');
var router = express.Router();
var logHelper = require('../src/logHelper');
var moment = require('moment');


var log = logHelper.createLogger();

/* GET home page. */
router.get('/', function(req, res) {
    var lastSeen;

    log.debug('Cookies ' + JSON.stringify(req.cookies));
  
    const cookieOptions = {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        signed: false,
        secure: false,
        sameSite: "strict"

    };

    //Extracting and showing last time visited in cookie
    if (req.cookies.sMailandStuff_lasttimeseen) {
        lastSeen = req.cookies.sMailandStuff_lasttimeseen;
    }

    //Setting last time visited for index page
    var nowD = moment().utc().format('LLLL');
    res.cookie('sMailandStuff_lasttimeseen',nowD, cookieOptions);

    res.render('index', { title: 'sMailandStuff - Demo Web App', user: req.user, lastSeen: lastSeen });
});

module.exports = router;

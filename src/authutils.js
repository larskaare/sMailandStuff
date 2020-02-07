/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

/**
 * A module for various authentication logics that potentially will be used a lot all over
 */

var config = require('../config/config.js');
var rp = require('request-promise');
var jwtDecode = require('jwt-decode');
var logHelper = require('./logHelper');
var apputils = require('./apputils');
var _ = require('lodash');

var log = logHelper.createLogger();

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
    return false;
};


exports.getLocalConfig = function() {
    var localConfig={};

    var port = apputils.normalizePort(process.env.PORT || '3000');

    // Determing the url of the server. Using Radix env. varibles
    var hostDomainName = (process.env.RADIX_PUBLIC_DOMAIN_NAME || 'localhost');
    var hostUrl = '';
    var hostUrlWithPort = '';

    if (hostDomainName !== 'localhost') {
        hostUrl = 'https://' + hostDomainName;
    } else {
        hostUrl = 'http://' + hostDomainName;
    }

    hostUrlWithPort = hostUrl + ':' + port;
 
    // Reading vital config from environment variables
    //
       
    localConfig.IDENTITYMETADATA = 'https://login.microsoftonline.com/' + (process.env.TENANTID) + '/v2.0/.well-known/openid-configuration';
    localConfig.CLIENTID = (process.env.CLIENTID || config.creds.clientID);
    localConfig.CLIENTSECRET = (process.env.CLIENTSECRET || config.creds.clientSecret);
    
    //If we are running in the cloud we do not, usually, specify port as it's 80
    if (hostDomainName !== 'localhost') {
        localConfig.REDIRECTURL = hostUrl + (process.env.REDIRECTURL || config.creds.redirectUrl);
        localConfig.DESTROYSESSIONURL = (process.env.DESTROYSESSIONURL || config.destroySessionUrl) + hostUrl;
    
    } else {
        localConfig.REDIRECTURL = hostUrlWithPort + (process.env.REDIRECTURL || config.creds.redirectUrl);
        localConfig.DESTROYSESSIONURL =  (process.env.DESTROYSESSIONURL || config.destroySessionUrl) + hostUrlWithPort;
    }
    
    localConfig.hostDomainName = hostDomainName;
    localConfig.hostUrl = hostUrl;
    localConfig.hostUrlWithPort = hostUrlWithPort;
    localConfig.port = port;

    return localConfig;

};


//The logics to determine if a refresh of the access token should be done.
exports.considerRefresh = async function (req, res, next) {

    if (_.has(req, 'user.authInfo.access_token_rep')) {

        const currExp = req.user.authInfo.access_token_exp;
        const currDate = new Date();
        const currTime = Math.round(currDate.getTime() / 1000);

        //Differene in seconds between expire time and now before we refresh token
        const diffSecondsBeforeRefresh = config.diffSecondsBeforeRefresh;

        if ((currExp - currTime) <= diffSecondsBeforeRefresh) {
            log.info('Attemting to refresh access token (limit: ' + diffSecondsBeforeRefresh +  ', refresh at or after: ' + (currExp - currTime) + ')');
            const metaData = await getMetaData();
            const newAccessToken = await getNewAccessToken(metaData,req.user.authInfo.refresh_token);
            const newExpireDate = returnExpFromAccessToken(newAccessToken);
        
            // eslint-disable-next-line require-atomic-updates
            req.user.authInfo.access_token = newAccessToken;
            // eslint-disable-next-line require-atomic-updates
            req.user.authInfo.access_token_exp = newExpireDate;

        } else {
        // console.log('***** I Will NOT ******** >>',(currExp - currTime));
        // Not refreshing yet
        }


    } else {
        next();
    }


   
};

//Function to get metadata from Azure
async function getMetaData () {
    var lConfig = module.exports.getLocalConfig();

    var options = {
        uri: lConfig.IDENTITYMETADATA,
        json: true
    };
  
    const result = await rp(options);

    return result;

}

async function getNewAccessToken(metadata,refresh_token) {
    var lConfig = module.exports.getLocalConfig();


    var options = {
        method: 'POST',
        uri: metadata.token_endpoint,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'client_id' : lConfig.CLIENTID,
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token',
            'client_secret': lConfig.CLIENTSECRET
        }
    };
  
    const responseBody = await rp(options);
    const response = JSON.parse(responseBody);

    return response.access_token;
    
}

function returnExpFromAccessToken(access_token) {

    var decoded = jwtDecode(access_token);

    return decoded.exp;

}
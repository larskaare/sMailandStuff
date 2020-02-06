//
// Gathering log definers in a helper library
// Create logger is for logging outside the express middleware
// Express logger config defines express middleware logging levels 
//

var bunyan = require('bunyan');
var config = require('../config/config.js');


//Logger for non middleware
exports.createLogger = function(){

    switch (process.env.NODE_ENV) {

    case 'development':
        return bunyan.createLogger({
            name: 'sMailandStuff',
            stream: process.stdout,
            level: config.appConfig.logLevel.development       
        });

    case 'debug':
        return bunyan.createLogger({
            name: 'sMailandStuff',
            stream: process.stdout,
            level: config.appConfig.logLevel.debug       
        });

    case 'production':
        return bunyan.createLogger({
            name: 'sMailandStuff',
            stream: process.stdout,
            level: config.appConfig.logLevel.production       
        });

     case 'test':
        return bunyan.createLogger({
            name: 'sMailandStuff-test',
            streams: [{
                path: './test/log/test.log',
            }],
            level: config.appConfig.logLevel.development       
        });

    default:
        return bunyan.createLogger({
            name: 'sMailandStuff',
            stream: process.stdout,
            level: config.appConfig.logLevel.development       
        });
    }

};

//Environmental aware config for the middleware
exports.expressLoggerConfig = function() {
    var log = module.exports.createLogger();

    switch (process.env.NODE_ENV) {

    case 'development':
        log.info('Expresslogger - development');
        return {name: 'DEVELOPMENT',
            streams: [{
                level: config.appConfig.logLevel.development,
                stream: process.stdout
            }],
            excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res','body']
        };

    case 'production':
        log.info('Expresslogger - production');
        return {name: 'PRODUCTION',
            streams: [{
                level: config.appConfig.logLevel.production,
                stream: process.stdout
            }],
            excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res']
        };

    case 'debug':
        log.info('Expresslogger - debug');
        return {name: 'DEBUG',
            streams: [{
                level: config.appConfig.logLevel.debug,
                stream: process.stdout
            }],
            // excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res']
        };

    case 'test':
        log.info('Expresslogger - test');
        return {name: 'TEST',
            streams: [{
                level: config.appConfig.logLevel.development,
                path: './test/log/test_express.log',
            }],
            // excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res']
        };

    default :
    log.info('Expresslogger - default');
        return {name: process.env.NODE_ENV,
            streams: [{
                level: 'warn',
                stream: process.stdout
            }],
            excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res']
        };
                                                    
    }

    
};


/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';
var expect = require('chai').expect;

var authutils = require ('../src/authutils');

//Testing ensureAuthenticated
describe('ensureAuthenticated(val)', function () {

    it('should return true when authenticated', function() {

        var req = {
            isAuthenticated: function() {
                return true;
            } 
        };
        var res = {};
    


        var ensureAuthenticated = authutils.ensureAuthenticated(req,res, function() {return req.isAuthenticated()});

        expect(ensureAuthenticated).to.be.true;

        
    });
    // it('should normalise string 3000 to int 3000', function () {
    //     var port = '3000';
    //     var normalizedPort = apputils.normalizePort(port);

    //     expect(normalizedPort).to.be.equal(3000);
    // });

    // it('should return value of type number', function () {
    //     var port = '3000';
    //     var normalizedPort = apputils.normalizePort(port);

    //     expect(normalizedPort).to.be.a('number');
    // });


});
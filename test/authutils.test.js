/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';
var expect = require('chai').expect;
var sinon = require('sinon');

var authutils = require ('../src/authutils');

//Testing ensureAuthenticated
describe('ensureAuthenticated(res,req,next)', function () {

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
   
    it('should return false and redirect to root when not authenticated', function() {

        var req = {
            isAuthenticated: function() {
                return false;
            } 
        };
        var res = {
            redirect: function() {
                return '/';
            }
        };
    
        var spy = sinon.spy(res,'redirect');

        var ensureAuthenticated = authutils.ensureAuthenticated(req,res, {});

        expect(ensureAuthenticated).to.be.false;

        //Testing if the redirect funtion was called
        expect(spy.callCount).to.be.equal(1);

        //Testing that the redirect send you to root - this test does not give a lot of value :)
        expect(spy.returnValues[0]).to.be.equal('/');


    });

});


//Testing considerRefesh
describe('considerRefresh(res,req,next)', function () {

    it('Should exit if request does not contain an access_token_expire object', function() {

        var req = {};
        var res = {};

        var next = {
            next : function() { 
                return true;
            }
        };

        var spy = sinon.spy(next,'next');

        var considerRefresh = authutils.considerRefresh(req, res, next.next);

        expect(spy.calledOnce).to.be.true;
        
        
    });

    it('Should contimnue if request contain an access_token_expire object', function() {

        var req = {
            user: {
                authInfo: {
                    access_token_rep: ''
                }
            }
        };

        var res = {};

        var next = {
            next : function() { 
                return true;
            }
        };

        var spy = sinon.spy(next,'next');

        var considerRefresh = authutils.considerRefresh(req, res, next.next);

        expect(spy.calledOnce).to.be.false;
        
        
    });
   
    

});
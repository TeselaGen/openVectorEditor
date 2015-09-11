// var tap = require('tap');
// tap.mochaGlobals();
var chai = require("chai");
chai.should();
var expect = chai.expect;
var ac = require('./apiCheck.js');
describe('apiCheck custom checks!', function() {
    it('does not throw range errors if passed a valid range', function() {
        var errorThrown = false;
        try {
            ac.throw(ac.range, {start: 1, end: 10});
        } catch(e) {
            if (e) {
                errorThrown = true;
            }
        }
        errorThrown.should.equal(false);
    });
    it('does throw range errors if passed an invalid range', function() {
        var errorThrown = false;
        try {
            ac.throw(ac.range, {start: -1, end: 10});
        } catch(e) {
            if (e) {
                errorThrown = true;
            }
        }
        errorThrown.should.equal(true);
    });
});
// // var tap = require('tap');
// // tap.mochaGlobals();
// var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');
// var chai = require("chai");
// chai.should();
// var ac = require('./apiCheck.js');
// describe('apiCheck range!', function() {
//     it('does not throw range errors if passed a valid range', function() {
//         function throwError () {
//             ac.throw(ac.range, {start: 1, end: 10});
//         }
//         throwError.should.not.throw()
//     });
//     it('does throw range errors if passed an invalid range', function() {
//         function throwError () {
//             ac.throw(ac.range, {start: -1, end: 10});
//         }
//         throwError.should.throw()
//     });
// });
// describe('sequenceData!', function() {
//     it('does not throw errors if passed a valid sequenceData object', function() {
//         var newSeq = tidyUpSequenceData({});
//         function throwError () {
//             ac.throw(ac.sequenceData, newSeq);
//         }
//         throwError.should.not.throw()
//     });
//     it('does not throw errors if passed a valid sequenceData object', function() {
//         var newSeq = tidyUpSequenceData({});
//         newSeq.cutsites[0] = {start: 1, end : 10};
//         function throwError () {
//             ac.throw(ac.sequenceData, newSeq);
//         }
//         throwError.should.not.throw()
//     });
//     it('does throw errors if passed an invalid sequenceData object', function() {
//         var newSeq = tidyUpSequenceData({});
//         delete newSeq.cutsites;
//         function throwError () {
//             ac.throw(ac.sequenceData, newSeq);
//         }
//         throwError.should.throw()
//     });
//     it('does throw errors if passed an invalid sequenceData object', function() {
//         var newSeq = tidyUpSequenceData({});
//         newSeq.cutsites[0] = {start: -1, end : 10};
//         function throwError () {
//             ac.throw(ac.sequenceData, newSeq);
//         }
//         throwError.should.throw()
//     });
// });
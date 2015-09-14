//tnr: half finished test. 
// var tap = require('tap');
// tap.mochaGlobals();
var chai = require("chai");
chai.should();
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

var tidyUpSequenceData = require('./tidyUpSequenceData');
var insertSequenceDataAtPosition = require('./insertSequenceDataAtPosition');

describe('insertSequenceData', function() {
    it('inserts characters at correct caret position', function() {
        var seqToInsert = {
            sequence: 'atgagagaga'
        };
        var preInsertSeq = {
            sequence: '0'
        };
        seqToInsert = tidyUpSequenceData(seqToInsert);
        var caretPosition = 0;
        preInsertSeq = tidyUpSequenceData({});
        var postInsertSeq = insertSequenceDataAtPosition(seqToInsert, preInsertSeq, caretPosition)
        postInsertSeq.sequence.length.should.equal(preInsertSeq.sequence.length + seqToInsert.sequence.length);
    });
    it('inserts characters at correct caret position', function() {
        var seqToInsert = {
            sequence: 'atgagagaga'
        };
        var preInsertSeq = {
            sequence: 'atgagagaga',
            features: [{start: 0, end: 9}]
        };
        seqToInsert = tidyUpSequenceData(seqToInsert);
        preInsertSeq = tidyUpSequenceData(preInsertSeq);
        var caretPosition = 0;
        var postInsertSeq = insertSequenceDataAtPosition(seqToInsert, preInsertSeq, caretPosition)
        postInsertSeq.sequence.length.should.equal(preInsertSeq.sequence.length + seqToInsert.sequence.length);
        postInsertSeq.features.length.should.equal(1);
        postInsertSeq.features[0].start.should.equal(preInsertSeq.features[0].start + seqToInsert.sequence.length);
    });
});
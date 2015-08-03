var tap = require('tap');
tap.mochaGlobals();
var getSequenceWithinRange = require('../app/getSequenceWithinRange.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('../app/collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
var assert = require('assert');
var subseq;

describe('getSequenceWithinRange', function() {
	it('gets a non circular range', function() {
		subseq = getSequenceWithinRange({start: 0,end:0},'atgc');
		assert.equal(subseq, 'a');
		subseq = getSequenceWithinRange({start: 1,end:1},'atgc');
		assert.equal(subseq, 't');
		subseq = getSequenceWithinRange({start: 0,end:3},'atgc');
		assert.equal(subseq, 'atgc');
	});
	it('gets a circular range', function() {
		subseq = getSequenceWithinRange({start: 1,end:0},'atgc');
		assert.deepEqual(subseq, 'tgca');
		subseq = getSequenceWithinRange({start: 2,end:1},'atgc');
		assert.deepEqual(subseq, 'gcat');
		subseq = getSequenceWithinRange({start: 3,end:0},'atgc');
		assert.deepEqual(subseq, 'ca');
	});
	it('gets a circular range', function() {
		subseq = getSequenceWithinRange({start: 1,end:0},'atgc');
		assert.deepEqual(subseq, 'tgca');
		subseq = getSequenceWithinRange({start: 2,end:1},'atgc');
		assert.deepEqual(subseq, 'gcat');
		subseq = getSequenceWithinRange({start: 3,end:0},'atgc');
		assert.deepEqual(subseq, 'ca');
	});
});
var tap = require('tap');
tap.mochaGlobals();
var zeroSubrangeByContainerRange = require('../app/zeroSubrangeByContainerRange.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('../app/collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
var assert = require('assert');
describe('zeroSubrangeByContainerRange', function() {
	it('zeros non circular range if fully overlapped', function() {
		assert.deepEqual(zeroSubrangeByContainerRange({
			start: 10,
			end: 20
		}, {
			start: 10,
			end: 20
		}, 30), null);
	});
});
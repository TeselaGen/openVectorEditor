// module.exports = function isPositiveInteger(value) {
//   if (
//     value % 1 === 0 &&
//     value > -1
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };

var isPositiveInteger = require('../app/isPositiveInteger.js');
var assert = require('assert');

describe('isPositiveInteger', function() {
	it('returns true when passed a positive integer', function() {
		assert.equal(isPositiveInteger(0), true);
		assert.equal(isPositiveInteger(-0), true);
		assert.equal(isPositiveInteger(1), true);
		assert.equal(isPositiveInteger(5704), true);
		assert.equal(isPositiveInteger(100000), true);
	});

	it('returns false when passed anything that isn\'t a positive integer', function() {
		assert.equal(isPositiveInteger(-1), false);
		assert.equal(isPositiveInteger(-5704), false);
		assert.equal(isPositiveInteger(-100000), false);
		assert.equal(isPositiveInteger(1.5), false);
		assert.equal(isPositiveInteger(400.554), false);
		assert.equal(isPositiveInteger(null), false);
		assert.equal(isPositiveInteger({}), false);
		assert.equal(isPositiveInteger([]), false);
		assert.equal(isPositiveInteger(undefined), false);
	});
});
var arePositiveIntegers = require('validate.io-nonnegative-integer-array');
module.exports = function areRangesValid(arrayOfRanges, maxLength) {
	if (!arePositiveIntegers([maxLength])) {
		return false;
	}
	if (!Array.isArray(arrayOfRanges)) {
		return false;
	}
	arrayOfRanges.forEach(function(range){
		if (typeof range !== 'object') {
			return false;
		} 
		if (!arePositiveIntegers([range.start, range.end])) {
			return false;
		}
		if (range.start >= maxLength || range.end >= maxLength) {
			return false;
		}
	});
	return true;
};
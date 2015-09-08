var ac = require('./apiCheck');
module.exports = function reversePositionInRange(position, rangeLength) {
	ac.throw([
        ac.posInt,
        ac.posInt,
    ], arguments);
	if (!areNonNegativeIntegers([rangeLength])) {
		throw new Error('must pass a rangeLength!');
	}
	if (areNonNegativeIntegers([position])) {
		return rangeLength - position;
	} else {
		return position;
	}
};
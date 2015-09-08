var ac = require('./apiCheck');	
	// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
module.exports = function normalizePositionByRangeLength(pPosition, sequenceLength) {
	debugger;
	ac.throw([ac.posInt, ac.posInt], arguments);
	var position = pPosition;
	if (position < 0) {
		position += sequenceLength;
	} else if (position > sequenceLength) {
		position -= sequenceLength;
	}
	return position;
};
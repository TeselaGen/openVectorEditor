var ac = require('./apiCheck');	
	// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
module.exports = function normalizePositionByRangeLength(pPosition, sequenceLength, circular) {
	ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
	var position = pPosition;
	if (position < 0) {
		if (!circular) {
			return false;
		}
		position += sequenceLength;
	} else if (position > sequenceLength) {
		if (!circular) {
			return false;
		}
		position -= sequenceLength;
	}
	return position;
};
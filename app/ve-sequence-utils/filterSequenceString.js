var ac = require('ve-api-check');
module.exports = function filterSequenceString(sequenceString) {
	ac.warn(ac.string,sequenceString);
	return sequenceString.replace(/[^atgcyrswkmbvdhn]/ig, '');
}

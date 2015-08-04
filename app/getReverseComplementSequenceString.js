var DNAReverseComplementMap = require('./DNAReverseComplementMap');
module.exports = function getReverseComplementSequenceString (sequence) {
	if (!sequence) {
		console.warn('no sequence passed!');
		return "";
	}
	var reverseComplementSequenceString = "";
	for (var i = sequence.length - 1; i >= 0; i--) {
		var revChar = DNAReverseComplementMap[sequence[i]];
		if (!revChar) {
			revChar = sequence[i];
			// throw new Error('trying to get the reverse compelement of an invalid base');
		}
		reverseComplementSequenceString+= revChar;
	}
	return reverseComplementSequenceString;
};
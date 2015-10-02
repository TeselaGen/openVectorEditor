var DNAReverseComplementMap = require('./DNAReverseComplementMap');
var ac = require('ve-api-check'); 
// ac.warn([ac.string,ac.bool],arguments);
module.exports = function getReverseComplementSequenceString (sequence) {
	ac.warn([ac.string],arguments);
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
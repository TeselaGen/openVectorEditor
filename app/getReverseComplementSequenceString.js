var DNAReverseComplementMap = require('DNAReverseComplementMap');
module.exports = function getReverseComplementSequenceString (sequence) {
	var reverseComplementSequenceString = ""
	for (var i = sequence.length - 1; i >= 0; i--) {
		reverseComplementSequenceString+= DNAReverseComplementMap(sequence[i])
	};
	return reverseComplementSequenceString
}
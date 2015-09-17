var ac = require('ve-api-check');
module.exports = function filterSequenceString(sequenceString) {
	ac.throw(ac.string,sequenceString);
	var index;
	var validDnaChars = ['a', 'c', 'g', 't', 'r', 'y', 's', 'w', 'k', 'm', 'b', 'd', 'h', 'v', 'n', 'A', 'C', 'G', 'T', 'R', 'Y', 'S', 'W', 'K', 'M', 'B', 'D', 'H', 'V', 'N'];
	var filteredString = '';
	for (index = 0; index < sequenceString.length; ++index) {
		// if char is valid...
		if (validDnaChars.indexOf(sequenceString[index]) != -1) {
			filteredString += (sequenceString[index]);
		}

	}
	return filteredString; //a subset of the original sequenceString containing only valid DNA, or nothing
}

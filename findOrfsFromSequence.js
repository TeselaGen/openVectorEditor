var arePositiveIntegers = require('../arePositiveIntegers');
module.exports = function findOrfsFromSequence(sequence, isCircular) {
	getAminoAcidsFromSequenceString(sequence, isCircular, 0);
	getAminoAcidsFromSequenceString(sequence, isCircular, 1);
	getAminoAcidsFromSequenceString(sequence, isCircular, 2)
	function getAminoAcidsFromSequenceString (sequence, isCircular, frame) {
		if (!arePositiveIntegers(frame)) {
			frame = 0; //set the frame to 0 if one isn't passed
		}
		if (isCircular) {
			
		} else {
			
		}
		sequence 
	}
};
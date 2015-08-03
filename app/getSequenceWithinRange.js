module.exports = function getSequenceWithinRange(range, sequence) {
	if (range.start > range.end) {
		//circular range 
		var subSequence = sequence.slice(range.start, sequence.length);
		subSequence += sequence.slice(0, range.end + 1);
		return subSequence;
	} else {
		return sequence.slice(range.start, range.end + 1);
	}
};
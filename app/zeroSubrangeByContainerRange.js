/**
 * adjust subRange to "believe" container range starts at 0.
 * @param  {object} subRange  {start:
 *                                 	end:
 *                                 	}
 * @param  {object} containerRange {start:
 *                                 	end:
 *                                 	}
 * @param  {int} sequenceLength 
 * @return {object}                {start:
 *                                 	end:
 *                                 	}
 */
module.exports = function zeroSubrangeByContainerRange(subRange, containerRange, sequenceLength) {
	//first check to make sure the continer range fully contains the subRange
	if (containerRange.start > containerRange.end) {
		if (subRange.start > containerRange.start && subRange.start < containerRange.end) {
			throw new Error('subRange must be fully contained by containerRange! Otherwise this function does not make sense')
		}
		if (subRange.end > containerRange.start && subRange.end < containerRange.end) {
			throw new Error('subRange must be fully contained by containerRange! Otherwise this function does not make sense')
		}
	} else {
		if (subRange.start < containerRange.start || subRange.end > containerRange.end) {
			throw new Error('subRange must be fully contained by containerRange! Otherwise this function does not make sense')
		}
	}
	subRange.start -= containerRange.start;
	subRange.end -= containerRange.end;
	if (subRange.start < 0) {
		subRange.start += sequenceLength;
	}
	if (subRange.end < 0) {
		subRange.end += sequenceLength;
	}
};
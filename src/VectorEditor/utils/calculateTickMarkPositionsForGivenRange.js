import norm from 've-range-utils/normalizePositionByRangeLength';
import getRangeLength from 've-range-utils/getRangeLength';
module.exports = function calculateTickMarkPositionsForGivenRange({tickSpacing, range, sequenceLength}) {

    var rangeLength = getRangeLength(range, sequenceLength)


    var firstTickOffsetFromRangeStart
    if (range.start > range.end) {
    	// range spans origin, so make sure the 0 bp is included!
    	firstTickOffsetFromRangeStart = (sequenceLength - range.start) % tickSpacing + 1
    } else {
    	firstTickOffsetFromRangeStart = tickSpacing - (range.start % tickSpacing);
    }
    var tickMarks = [];
    if (range.start === 0) tickMarks.push(0)
    for (var tick = firstTickOffsetFromRangeStart-1; tick < rangeLength; tick += tickSpacing) {
        tickMarks.push(norm(tick, sequenceLength));
    }
    return tickMarks;
}
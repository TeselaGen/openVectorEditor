import norm from 've-range-utils/normalizePositionByRangeLength';
import getRangeLength from 've-range-utils/getRangeLength';
module.exports = function calculateTickMarkPositionsForGivenRange({tickSpacing, range, sequenceLength}) {
    var rangeLength = getRangeLength(range, sequenceLength)
    var firstTickOffsetFromRangeStart = tickSpacing - (range.start % tickSpacing);
    var tickMarks = [];
    for (var tick = firstTickOffsetFromRangeStart-1; tick < rangeLength; tick += tickSpacing) {
        tickMarks.push(norm(tick, sequenceLength));
    }
    return tickMarks;
}
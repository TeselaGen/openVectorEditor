module.exports = function calculateTickMarkPositionsForGivenRange({tickSpacing, range}) {
    var rangeLength = range.end - range.start;
    var firstTickOffsetFromRangeStart = tickSpacing - (range.start % tickSpacing);
    var arrayOfTickMarkPositions = [];
    for (var tickMarkPositions = firstTickOffsetFromRangeStart; tickMarkPositions < rangeLength; tickMarkPositions += tickSpacing) {
        arrayOfTickMarkPositions.push(tickMarkPositions);
    }
    return arrayOfTickMarkPositions;
}
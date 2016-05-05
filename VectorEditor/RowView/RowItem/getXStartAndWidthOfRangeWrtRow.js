// import getOverlapsOfPotentiallyCircularRanges from 've-range-utils/getOverlapsOfPotentiallyCircularRanges';
// import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
// module.exports = function getXStartAndWidthOfRangeWrtRow(range, row, bpsPerRow, charWidth, sequenceLength) {
//     var overlaps = getOverlapsOfPotentiallyCircularRanges(range, row, sequenceLength);
//     return overlaps.map(function (overlap) {
//     	return {
//     		...overlap,
//         	xStart: normalizePositionByRangeLength(overlap.start - row.start, sequenceLength) * charWidth,
//         	width: (normalizePositionByRangeLength(range.end + 1 - range.start, sequenceLength)) * charWidth,
    		
//     	}
//     })
// };

import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
module.exports = function getXStartAndWidthOfRangeWrtRow(range, row, bpsPerRow, charWidth, sequenceLength) {
    return {
        xStart: normalizePositionByRangeLength(range.start - row.start, sequenceLength) * charWidth,
        width: (normalizePositionByRangeLength(range.end + 1 - range.start, sequenceLength)) * charWidth,
    };
};
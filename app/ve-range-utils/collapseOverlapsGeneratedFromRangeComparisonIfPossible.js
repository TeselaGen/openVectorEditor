module.exports = function collapseOverlapsGeneratedFromRangeComparisonIfPossible(overlaps, sequenceLength) {
    //this function is a little confusing, but basically it takes an array of overlaps 
    //generated from a range overlaps calculation, and it sews them together if possible
    if (overlaps.length === 1 || overlaps.length === 0) {
        return overlaps;
    } else if (overlaps.length === 2) {
        if (overlaps[0].start === 0 && overlaps[1].end + 1 === sequenceLength) {
            return [{
                start: overlaps[1].start,
                end: overlaps[0].end
            }];
        } else if (overlaps[1].start === 0 && overlaps[0].end + 1 === sequenceLength) {
            return [{
                start: overlaps[0].start,
                end: overlaps[1].end
            }];
        } else {
            return overlaps;
        }
    } else if (overlaps.length === 3) {
        var firstOverlap = overlaps[0];
        var secondOverlap = overlaps[1];
        var thirdOverlap = overlaps[2];
        var collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible([firstOverlap, secondOverlap], sequenceLength);
        if (collapsedOverlaps.length === 1) {
            collapsedOverlaps.push(thirdOverlap);
            return collapsedOverlaps;
        } else {
            collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible([firstOverlap, thirdOverlap], sequenceLength);
            if (collapsedOverlaps.length === 1) {
                collapsedOverlaps.push(secondOverlap);
                return collapsedOverlaps;
            } else {
                collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible([secondOverlap, thirdOverlap], sequenceLength);
                if (collapsedOverlaps.length === 1) {
                    collapsedOverlaps.push(firstOverlap);
                    return collapsedOverlaps;
                } else {
                    return overlaps;
                }
            }
        }
    }
};
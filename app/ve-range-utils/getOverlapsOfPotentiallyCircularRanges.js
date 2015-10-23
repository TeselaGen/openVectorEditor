import splitRangeIntoTwoPartsIfItIsCircular from './splitRangeIntoTwoPartsIfItIsCircular';
import getOverlapOfNonCircularRanges from './getOverlapOfNonCircularRanges';
//returns an array of the overlaps between two potentially circular ranges
import ac from 've-api-check'; 
// ac.throw([ac.string,ac.bool],arguments);
export default function getOverlapsOfPotentiallyCircularRanges(rangeA, rangeB, maxRangeLength) {
    ac.throw([ac.range,ac.range,ac.posInt],arguments);

    var normalizedRangeA = splitRangeIntoTwoPartsIfItIsCircular(rangeA, maxRangeLength);
    var normalizedRangeB = splitRangeIntoTwoPartsIfItIsCircular(rangeB, maxRangeLength);

    var overlaps = [];
    normalizedRangeA.forEach(function(nonCircularRangeA) {
        normalizedRangeB.forEach(function(nonCircularRangeB) {
            var overlap = getOverlapOfNonCircularRanges(nonCircularRangeA, nonCircularRangeB);
            if (overlap) {
                overlaps.push(overlap);
            }
        });
    });
    return overlaps;
}



import areNonNegativeIntegers from 'validate.io-nonnegative-integer-array';
import ac from 've-api-check'; 
// ac.throw([ac.string,ac.bool],arguments);
export default function getOverlapOfNonCircularRanges(rangeA, rangeB) {
    ac.throw([ac.range,ac.range],arguments);
    if (rangeA.start < rangeB.start) {
        if (rangeA.end < rangeB.start) {
      //no overlap
        } else {
            if (rangeA.end < rangeB.end) {
                return {
                    start: rangeB.start,
                    end: rangeA.end
                };
            } else {
                return {
                    start: rangeB.start,
                    end: rangeB.end
                };
            }
        }
    } else {
        if (rangeA.start > rangeB.end) {
      //no overlap
        } else {
            if (rangeA.end < rangeB.end) {
                return {
                    start: rangeA.start,
                    end: rangeA.end
                };
            } else {
                return {
                    start: rangeA.start,
                    end: rangeB.end
                };
            }
        }
    }
}
import ac from 've-api-check'; 
  // ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
//takes a potentially circular range and returns an array containing the range split on the origin
module.exports = function splitRangeIntoTwoPartsIfItIsCircular(range, maxRangeLength) {
    ac.throw([ac.range, ac.posInt], arguments);
    if (range.start <= range.end) {
    //the range isn't circular, so we just return the range
        return [{
            start: range.start,
            end: range.end
        }];
    } else {
    //the range is cicular, so we return an array of two ranges
        return [{
            start: 0,
            end: range.end
        }, {
            start: range.start,
            end: maxRangeLength - 1
        }];
    }
};
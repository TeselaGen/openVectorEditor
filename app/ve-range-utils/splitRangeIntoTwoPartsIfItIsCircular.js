var ac = require('ve-api-check'); 
  // ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
//takes a potentially circular range and returns an array containing the range split on the origin
module.exports = function splitRangeIntoTwoPartsIfItIsCircular(range, sequenceLength) {
    ac.throw([ac.range, ac.number], arguments);
    var ranges = [];
    if (range.start > range.end) {
        //the range is cicular, so we return an array of two ranges
        ranges.push({
            start: 0,
            end: range.end,
            type: "end",
        });
        ranges.push({
            start: range.start,
            end: sequenceLength - 1,
            type: "beginning",
        });
    } else {
        //the range isn't circular, so we just return the range
        ranges.push({
            start: range.start,
            end: range.end,
            type: "beginningAndEnd",
        });
    }
    return ranges;
}
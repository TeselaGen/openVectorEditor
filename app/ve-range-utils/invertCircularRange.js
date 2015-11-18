require('chai').should()
var normalizePositionByRangeLength = require('./normalizePositionByRangeLength');
module.exports = function invertCircularRange(range, rangeMax) {
    var start = range.end + 1;
    var end = range.start - 1;
    return {
        start: normalizePositionByRangeLength(start, rangeMax, false),
        end: normalizePositionByRangeLength(end, rangeMax, false),
    }
}
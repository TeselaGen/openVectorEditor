var normalizePositionByRangeLength = require('./normalizePositionByRangeLength');
var assign = require('lodash/object/assign');
module.exports = function expandOrContractCircularRangeToPosition(range, position, maxLength) {

    // 0 1 2 3 4 5 6 7 8 9
    // r r r r r - - r r r
    //0 1 2 3 4 5 6 7 8 9 10
    //        | 
    var newRange = assign({}, range);
    var endMoved = true;
    if (range.end >= position) {
        if (position + maxLength - range.start > range.end - position) {
            newRange.end = normalizePositionByRangeLength(position - 1, maxLength, false);
        } else {
            newRange.start = position;
            endMoved = false;
        }
    } else {
        if (range.start < position) {
            if (range.end + maxLength - position > position - range.start) {
                newRange.start = position;
                endMoved = false;
            } else {
                newRange.end = position - 1;
            }
        } else {
            //position somewhere between end and start
            if (range.start - position > position - range.end) {
                newRange.end = position - 1;
            } else {
                endMoved = false;
                newRange.start = position;
            }
        }
    }
    return ({
        newRange, endMoved
    })
}
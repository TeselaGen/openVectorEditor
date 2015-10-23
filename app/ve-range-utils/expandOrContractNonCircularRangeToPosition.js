import assign from 'lodash/object/assign';
export default function expandOrContractNonCircularRangeToPosition (range, position) {
    var newRange = assign({},range);
    var endMoved = true;
    if (range.start > position) {
        newRange.start = position;
        endMoved = false;
    } else {
        if (range.end < position) {
            newRange.end = position - 1;
        } else {
            if (position - range.start > range.end - position) {
                newRange.end = position - 1;
            } else {
                newRange.start = position;
                endMoved = false;
            }
        }
    }
    return ({newRange, endMoved})
}
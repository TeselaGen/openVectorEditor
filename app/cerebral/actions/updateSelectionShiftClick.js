var expandOrContractNonCircularRangeToPosition = require('ve-range-utils/expandOrContractNonCircularRangeToPosition');
var expandOrContractCircularRangeToPosition = require('ve-range-utils/expandOrContractCircularRangeToPosition');
var ac = require('ve-api-check');
export default function updateSelectionShiftClick({input: {nearestBP, sequenceLength, caretPosition, selectionLayer}, state, output}) {
    if (true || selectionLayer.start > selectionLayer.end) {
        var {newRange, endMoved} = expandOrContractCircularRangeToPosition(selectionLayer, nearestBP, sequenceLength);
        newRange.cursorAtEnd = endMoved;
        output({selectionLayer: newRange})
    } else {
        /*eslint-disable no-redeclare*/
        var {newRange, endMoved} = expandOrContractNonCircularRangeToPosition(selectionLayer, nearestBP);
        /*eslint-enable no-redeclare*/
        newRange.cursorAtEnd = endMoved;
        output({selectionLayer: newRange})
    }
}

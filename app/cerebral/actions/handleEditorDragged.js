var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
var ac = require('ve-api-check');
export default function handleEditorDragged({
    nearestBP, circular, sequenceLength, bpsPerRow, caretPosition, selectionLayer, shiftHeld, type
}, tree, output) {

    if (selectionLayer.selected) 
}

handleCaretMoved.outputs = ['caretMoved', 'selectionUpdated'];
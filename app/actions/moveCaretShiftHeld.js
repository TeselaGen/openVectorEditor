var assign = require('lodash/object/assign');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');

/**
 * moves the caret while keeping the highlight layer selected
 * @param  {integer} moveBy positive/negative number to adjust the caret
 * @return {undefined}              
 */
export default function moveCaretShiftHeld({sequenceLength, selectionLayer, caretPosition, moveBy}, tree, output) {
    var newSelectionLayer = assign({}, selectionLayer);
    if (selectionLayer.selected) {
        if (newSelectionLayer.cursorAtEnd) {
            newSelectionLayer.end += moveBy;
            newSelectionLayer.end = trimNumberToFitWithin0ToAnotherNumber(newSelectionLayer.end, sequenceLength - 1);
        } else {
            newSelectionLayer.start += moveBy;
            newSelectionLayer.start = trimNumberToFitWithin0ToAnotherNumber(newSelectionLayer.start, sequenceLength - 1);
        }
        output({selectionLayer: newSelectionLayer});
    } else {
        if (moveBy > 0) {
            output({selectionLayer: {
                            start: caretPosition,
                            end: trimNumberToFitWithin0ToAnotherNumber(caretPosition + moveBy - 1, sequenceLength - 1),
                            cursorAtEnd: true
                        }});
        } else {
            output({selectionLayer: {
                start: trimNumberToFitWithin0ToAnotherNumber(caretPosition + moveBy, sequenceLength - 1),
                end: caretPosition - 1,
                cursorAtEnd: false
            }});
        }
    }
}
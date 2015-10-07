var assign = require('lodash/object/assign');
var setOrClearSelectionLayer = require('./setOrClearSelectionLayer.js');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');

/**
 * moves the caret while keeping the highlight layer selected
 * @param  {integer} numberToMove positive/negative number to adjust the caret
 * @return {undefined}              
 */
export default function moveCaretShiftHeld({numberToMove}, tree) {
    var selectionLayer = assign({}, tree.get('selectionLayer'));

    var sequenceLength = tree.get(['sequenceLength']);
    var caretPosition = JSON.parse(JSON.stringify(tree.get('caretPosition'))); //tnrtodo: this json stringify stuff is probably unneeded
    if (selectionLayer.selected) {
        if (selectionLayer.cursorAtEnd) {
            selectionLayer.end += numberToMove;
            selectionLayer.end = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.end, sequenceLength - 1);
        } else {
            selectionLayer.start += numberToMove;
            selectionLayer.start = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.start, sequenceLength - 1);
        }
        setOrClearSelectionLayer(selectionLayer);
    } else {
        if (numberToMove > 0) {
            setOrClearSelectionLayer({selectionLayer: {
                            start: caretPosition,
                            end: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove - 1, sequenceLength - 1),
                            cursorAtEnd: true
                        }}, tree);
        } else {
            setOrClearSelectionLayer({selectionLayer: {
                start: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove, sequenceLength - 1),
                end: caretPosition - 1,
                cursorAtEnd: false
            }}, tree);
        }
    }
}
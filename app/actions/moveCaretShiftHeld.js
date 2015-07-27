var tree = require('../baobabTree');
var assign = require('lodash/object/assign');
var trimNumberToFitWithin0ToAnotherNumber = require('../trimNumberToFitWithin0ToAnotherNumber');

module.exports = function moveCaretShiftHeld(numberToMove) {
    console.log('hey: ');
    var selectionLayer = assign({}, tree.select('vectorEditorState', 'selectionLayer').get());

    var sequenceLength = tree.get(['$sequenceLength']);
    var caretPosition = JSON.parse(JSON.stringify(tree.select('vectorEditorState', 'caretPosition').get())); //tnrtodo: this json stringify stuff is probably unneeded
    if (selectionLayer.selected) {
        if (selectionLayer.cursorAtEnd) {
            selectionLayer.end += numberToMove;
            selectionLayer.end = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.end, sequenceLength - 1);
        } else {
            selectionLayer.start += numberToMove;
            selectionLayer.start = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.start, sequenceLength - 1);
        }
        this.setSelectionLayer(selectionLayer);
    } else {
        if (numberToMove > 0) {
            this.setSelectionLayer({
                start: caretPosition,
                end: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove - 1, sequenceLength - 1),
                cursorAtEnd: true
            });
        } else {
            this.setSelectionLayer({
                start: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove + 1, sequenceLength - 1),
                end: caretPosition,
                cursorAtEnd: false
            });
        }
        caretPosition += numberToMove;
        if (caretPosition < 0) {
            caretPosition = 0;
        }
        if (caretPosition > sequenceLength) {
            caretPosition = sequenceLength;
        }
        tree.select('vectorEditorState', 'caretPosition').set(caretPosition);
    }
};
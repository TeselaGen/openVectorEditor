var tree = require('../baobabTree');
var trimNumberToFitWithin0ToAnotherNumber = require('../trimNumberToFitWithin0ToAnotherNumber');

module.exports = function moveCaret(numberToMove) {
    var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
    var sequenceLength = tree.get(['$sequenceLength']);
    var caretPosition = tree.select('vectorEditorState', 'caretPosition').get();
    if (selectionLayer.selected) {
        if (numberToMove > 0) {
            tree.select('vectorEditorState', 'caretPosition').set(selectionLayer.end + 1);
        } else {
            tree.select('vectorEditorState', 'caretPosition').set(selectionLayer.start);
        }
        this.setSelectionLayer(false);
    } else {
        caretPosition += numberToMove;
        caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
        tree.select('vectorEditorState', 'caretPosition').set(caretPosition);
    }
}
var tree = require('../baobabTree');
var setSelectionLayer = require('./setSelectionLayer.js');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');

module.exports = function moveCaret(numberToMove) {
    var selectionLayer = tree.select('selectionLayer').get();
    var sequenceLength = tree.get(['$sequenceLength']);
    var caretPosition = tree.select('caretPosition').get();
    if (selectionLayer.selected) {
        if (numberToMove > 0) {
            tree.select('caretPosition').set(selectionLayer.end + 1);
        } else {
            tree.select('caretPosition').set(selectionLayer.start);
        }
        setSelectionLayer(false);
    } else {
        caretPosition += numberToMove;
        caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
        tree.select('caretPosition').set(caretPosition);
    }
};
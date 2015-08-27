var tree = require('../baobabTree');
var assign = require('lodash/object/assign');
var setSelectionLayer = require('./setSelectionLayer.js');
var trimNumberToFitWithin0ToAnotherNumber = require('../trimNumberToFitWithin0ToAnotherNumber');

/**
 * moves the caret while keeping the highlight layer selected
 * @param  {integer} numberToMove positive/negative number to adjust the caret
 * @return {undefined}              
 */
module.exports = function moveCaretShiftHeld(numberToMove) {
    console.log('hey: ');
    var selectionLayer = assign({}, tree.select('selectionLayer').get());

    var sequenceLength = tree.get(['$sequenceLength']);
    var caretPosition = JSON.parse(JSON.stringify(tree.select('caretPosition').get())); //tnrtodo: this json stringify stuff is probably unneeded
    if (selectionLayer.selected) {
        if (selectionLayer.cursorAtEnd) {
            selectionLayer.end += numberToMove;
            selectionLayer.end = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.end, sequenceLength - 1);
        } else {
            selectionLayer.start += numberToMove;
            selectionLayer.start = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.start, sequenceLength - 1);
        }
        setSelectionLayer(selectionLayer);
    } else {
        if (numberToMove > 0) {
            setSelectionLayer({
                start: caretPosition,
                end: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove - 1, sequenceLength - 1),
                cursorAtEnd: true
            });
        } else {
            setSelectionLayer({
                start: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove, sequenceLength - 1),
                end: caretPosition - 1,
                cursorAtEnd: false
            });
        }
    }
};
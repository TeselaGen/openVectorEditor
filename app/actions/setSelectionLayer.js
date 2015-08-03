var tree = require('../baobabTree');
var setCaretPosition = require('./setCaretPosition');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

//takes in either (int,int) or ({start:int,end:int})
module.exports = function setSelectionLayer (newSelectionLayer) {
    var getRidOfCursor;
    var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
    if (!newSelectionLayer || typeof newSelectionLayer !== 'object') {
        newSelectionLayer = {
            start: -1,
            end: -1,
            selected: false,
            cursorAtEnd: true
        };
    } else {
        var start = newSelectionLayer.start;
        // var selected = newSelectionLayer.selected;
        var end = newSelectionLayer.end;
        var cursorAtEnd = newSelectionLayer.cursorAtEnd;
        // var {
        //     start, end, selected, cursorAtEnd
        // } = newSelectionLayer;
        if (areNonNegativeIntegers([start, end])) {
            newSelectionLayer = {
                start: start,
                end: end,
                selected: true,
                cursorAtEnd: cursorAtEnd
            };
            getRidOfCursor = true;
        } else {
            newSelectionLayer = {
                start: -1,
                end: -1,
                selected: false,
                cursorAtEnd: true
            };
        }
    }
    // if (!deepEqual(selectionLayer, newSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
    if (getRidOfCursor) {
        setCaretPosition(-1);
    }
    tree.select('vectorEditorState', 'selectionLayer').set(newSelectionLayer);
    // viewportDimensions.set(newSize);
};
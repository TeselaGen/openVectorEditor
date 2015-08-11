var tree = require('../baobabTree');
var setCaretPosition = require('./setCaretPosition');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
module.exports = function setSelectionLayer (newSelectionLayer) {
    var getRidOfCursor;
    var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
    if (!newSelectionLayer || typeof newSelectionLayer !== 'object') {
        //no selection layer passed, so cancel it
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
        var cursorAtEnd;
        if (newSelectionLayer.cursorAtEnd || typeof newSelectionLayer.cursorAtEnd === 'undefined') {
            //if cursorAtEnd is passed as true, or if no cursorAtEnd is passed, auto set it to true
            cursorAtEnd = true;
        } else {
            //if cursorAtEnd is explicitely passed as false, set it to false
            cursorAtEnd = false;
        }
        if (areNonNegativeIntegers([start, end])) {
            //valid selection layer passed, so set it.
            newSelectionLayer = {
                start: start,
                end: end,
                selected: true,
                cursorAtEnd: cursorAtEnd 
            };
            getRidOfCursor = true;
        } else {
            //invalid selection layer passed, so cancel it
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
};
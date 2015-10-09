var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
module.exports = function setOrClearSelectionLayerHelper (newSelectionLayer) {
    var getRidOfCursor;
    var updatedSelectionLayer;
    console.log('newSelectionLayer: ' + JSON.stringify(newSelectionLayer,null,4));
    if (!newSelectionLayer || typeof newSelectionLayer !== 'object' || !areNonNegativeIntegers([newSelectionLayer.start, newSelectionLayer.end])) {
        //no selection layer passed, so cancel it
        updatedSelectionLayer = {
            start: -1,
            end: -1,
            selected: false,
            cursorAtEnd: true
        };
    } else {
        //only do type checking if the argument is not falsey
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
            updatedSelectionLayer = {
                start: start,
                end: end,
                selected: true,
                cursorAtEnd: cursorAtEnd 
            };
            getRidOfCursor = true;
        } else {
            //invalid selection layer passed, so cancel it
            updatedSelectionLayer = {
                start: -1,
                end: -1,
                selected: false,
                cursorAtEnd: true
            };
        }
    }
    return({updatedSelectionLayer, getRidOfCursor});
};
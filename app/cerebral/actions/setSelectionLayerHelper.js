var assign = require('lodash/object/assign');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
module.exports = function setSelectionLayerHelper (newSelectionLayer) {
    var updatedSelectionLayer = {};
    if (!newSelectionLayer || typeof newSelectionLayer !== 'object' || !areNonNegativeIntegers([newSelectionLayer.start, newSelectionLayer.end])) {
        //no selection layer passed, so cancel it
        updatedSelectionLayer = {
            start: -1,
            end: -1,
            selected: false,
            cursorAtEnd: true
        };
    } else {
        updatedSelectionLayer = {
            start: newSelectionLayer.start,
            end: newSelectionLayer.end
        };
        updatedSelectionLayer.selected = true;
        if (newSelectionLayer.cursorAtEnd || typeof newSelectionLayer.cursorAtEnd === 'undefined') {
            //if cursorAtEnd is passed as true, or if no cursorAtEnd is passed, auto set it to true
            updatedSelectionLayer.cursorAtEnd = true;
        } else {
            //if cursorAtEnd is explicitely passed as false, set it to false
            updatedSelectionLayer.cursorAtEnd = false;
        }
    }
    return(updatedSelectionLayer);
};
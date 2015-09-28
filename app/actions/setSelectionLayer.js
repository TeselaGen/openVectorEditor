var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
export default function setSelectionLayer({newSelectionLayer}, tree, output) {
    var {
        updatedSelectionLayer, getRidOfCursor
    } = setSelectionLayerHelper(newSelectionLayer);
    var selectionCursor = tree.select('selectionLayer');
    if (!deepEqual(selectionCursor.get(), updatedSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
        selectionCursor.set(updatedSelectionLayer);
    }
    if (getRidOfCursor) {
        tree.select('caretPosition').set(-1);
    }
};
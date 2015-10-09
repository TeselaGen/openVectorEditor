var setOrClearSelectionLayerHelper = require('./setOrClearSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
export default function setOrClearSelectionLayer({selectionLayer}, tree) {
    var {
        updatedSelectionLayer, getRidOfCursor
    } = setOrClearSelectionLayerHelper(selectionLayer);
    if (!deepEqual(tree.get('selectionLayer'), updatedSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
        tree.set('selectionLayer', updatedSelectionLayer);
    }
    if (getRidOfCursor) {
        tree.set('caretPosition', -1);
    }
}
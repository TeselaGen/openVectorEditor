var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
export default function setCutsiteLabelSelection(newSelectionLayer, tree, output) {
    var {
        updatedSelectionLayer, getRidOfCursor
    } = setSelectionLayerHelper(newSelectionLayer);
    if (!deepEqual(tree.get('cutsiteLabelSelectionLayer'), updatedSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
        tree.set('cutsiteLabelSelectionLayer', updatedSelectionLayer);
    }
};
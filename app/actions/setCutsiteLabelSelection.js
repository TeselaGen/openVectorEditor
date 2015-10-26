import setSelectionLayerHelper from './setSelectionLayerHelper';
import deepEqual from 'deep-equal';
/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
export default function setCutsiteLabelSelection(newSelectionLayer, tree) {
    var updatedSelectionLayer = setSelectionLayerHelper(newSelectionLayer);
    if (!deepEqual(tree.get('cutsiteLabelSelectionLayer'), updatedSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
        tree.set('cutsiteLabelSelectionLayer', updatedSelectionLayer);
    }
}
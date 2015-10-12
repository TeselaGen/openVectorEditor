var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 */
export default function setSelectionLayer({selectionLayer}, tree) {
    var updatedSelectionLayer = setSelectionLayerHelper(selectionLayer);
    if (!deepEqual(tree.get('selectionLayer'), updatedSelectionLayer)) {
        tree.set('selectionLayer', updatedSelectionLayer);
    }
    if (updatedSelectionLayer.selected) {
        if (updatedSelectionLayer.cursorAtEnd) {
            tree.set('caretPosition', updatedSelectionLayer.end + 1);
        } else {
            tree.set('caretPosition', updatedSelectionLayer.start);
        }
    }
}
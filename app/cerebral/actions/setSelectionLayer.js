var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 */
export default function setSelectionLayer({input: {selectionLayer}, state}) {
    var updatedSelectionLayer = setSelectionLayerHelper(selectionLayer);
    if (!deepEqual(state.get('selectionLayer'), updatedSelectionLayer)) {
        state.set('selectionLayer', updatedSelectionLayer);
    }
    if (updatedSelectionLayer.selected) {
        if (updatedSelectionLayer.cursorAtEnd) {
            state.set('caretPosition', updatedSelectionLayer.end + 1);
        } else {
            state.set('caretPosition', updatedSelectionLayer.start);
        }
    }
}
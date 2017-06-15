var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 */
export default function setSelectionLayer({input: {selectionLayer, view}, state}) {
    var updatedSelectionLayer = setSelectionLayerHelper(selectionLayer);
    if (!deepEqual(state.get('selectionLayer'), updatedSelectionLayer)) {
        state.set('selectionLayer', updatedSelectionLayer);
    }
    if (updatedSelectionLayer.selected) {
        // makesure sidebar is on correct tab
        var type;
        if (selectionLayer.numberOfCuts) {
            type = 'Cutsites';
        } else if (selectionLayer.internalStartCodonIndices) {
            type = 'Orfs';
        } else if (selectionLayer.name) {
            type = 'Features';
        }
        if (type) {
            state.set('sidebarType', type);
        }

        if (updatedSelectionLayer.cursorAtEnd) {
            state.set('caretPosition', updatedSelectionLayer.end + 1);
        } else {
            state.set('caretPosition', updatedSelectionLayer.start);
        }
    }
}

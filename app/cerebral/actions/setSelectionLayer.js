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
        if (updatedSelectionLayer.cursorAtEnd) {
            state.set('caretPosition', updatedSelectionLayer.end + 1);
            state.set('showSidebar', true);

            // makesure sidebar open to correct tab
            var type = 'Features';
            if (selectionLayer.numberOfCuts) {
                type = 'Cutsites';
            } else if (selectionLayer.internalStartCodonIndices) {
                type = 'Orfs';
            }
            state.set('sidebarType', type);

            // keep view that was clicked on, close the other
            if (view === "row") {
                state.set('showRow', true);
                state.set('showCircular', false);
            } else if (view === "circular"){
                state.set('showRow', false);
                state.set('showCircular', true);
            }

        } else {
            state.set('caretPosition', updatedSelectionLayer.start);
        }
    }
}

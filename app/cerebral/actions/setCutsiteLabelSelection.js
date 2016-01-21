var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 * @param  {object} input {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
export default function setCutsiteLabelSelection({input, state}) {
    var updatedSelectionLayer = setSelectionLayerHelper(input);
    if (!deepEqual(state.get('cutsiteLabelSelectionLayer'), updatedSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
        state.set('cutsiteLabelSelectionLayer', updatedSelectionLayer);
    }
}
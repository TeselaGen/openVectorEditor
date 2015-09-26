var tree = require('../baobabTree');
var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
module.exports = function setSelectionLayer(newSelectionLayer) {
    var {
        updatedSelectionLayer, getRidOfCursor
    } = setSelectionLayerHelper(newSelectionLayer);
    if (!deepEqual(selectionLayer, updatedSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
        tree.select('selectionLayer').set(updatedSelectionLayer);
    }
    if (getRidOfCursor) {
        tree.select('selectionLayer').set(updatedSelectionLayer);
    }
};
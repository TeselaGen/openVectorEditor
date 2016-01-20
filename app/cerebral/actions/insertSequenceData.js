var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var ac = require('ve-api-check');
var setSelectionLayer = require('./setSelectionLayer');

export default function insertSequenceData({newSequenceData}, tree, output) {
    var { sequenceData, caretPosition } = tree.get();
    ac.throw(ac.posInt, caretPosition)
    ac.throw(ac.sequenceData, sequenceData)
    // ac.throw(ac.sequenceData, newSequenceData)
    tree.set('sequenceData', assign({}, sequenceData, insertSequenceDataAtPosition(newSequenceData, sequenceData, caretPosition)));
    tree.set('caretPosition', newSequenceData.sequence.length + caretPosition);
    setSelectionLayer(false, tree);
}
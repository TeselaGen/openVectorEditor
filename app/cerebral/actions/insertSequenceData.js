var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var setSelectionLayer = require('./setSelectionLayer');

export default function insertSequenceData({input, state, output}) {
    var { newSequenceData } = input;
    // console.log("input passed to insert is " + newSequenceData);
    var { sequenceData, caretPosition } = state.get();

    state.set('sequenceData', assign({}, sequenceData, insertSequenceDataAtPosition(newSequenceData, sequenceData, caretPosition)));
    state.set('caretPosition', newSequenceData.sequence.length + caretPosition);
}

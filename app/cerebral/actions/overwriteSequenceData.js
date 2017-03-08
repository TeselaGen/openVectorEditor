var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var setSelectionLayer = require('./setSelectionLayer');

function insertSequenceData({input, state, output}) {
    var { newSequenceData } = input;
    var newSeq = newSequenceData.sequence;
    var newName = newSequenceData.name;
    console.log(newSeq)
    console.log(newName)
    
    // clear previous state and delete sequence and features
    state.set('caretPosition', 0);
    state.set('history', [])
    state.set(['sequenceData', 'name'], newName);
    // state.set(['sequenceData', 'name'], newName)
}

export default insertSequenceData;
var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var ac = require('ve-api-check');

export default function insertSequenceData({input, state, output}) {
    // where is newsequencedata coming from, pass in input?
    var { sequenceData, newSequenceData, caretPosition } = state.get();
    ac.throw(ac.posInt, caretPosition)
    ac.throw(ac.sequenceData, sequenceData)
    ac.throw(ac.sequenceData, newSequenceData)
    //insert new sequence at the caret position
    output({
        sequenceData: assign({}, sequenceData, insertSequenceDataAtPosition(newSequenceData, sequenceData, caretPosition)),
        caretPosition: newSequenceData.sequence.length + caretPosition //update the caret position to be at the end of the newly inserted sequence
    })

}
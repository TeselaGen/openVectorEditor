import assign from 'lodash/object/assign';
import insertSequenceDataAtPosition from 've-sequence-utils/insertSequenceDataAtPosition';
import ac from 've-api-check';

export default function insertSequenceData({
    sequenceData, newSequenceData, caretPosition, 
}, tree, output) {
    ac.throw(ac.posInt, caretPosition)
    ac.throw(ac.sequenceData, sequenceData)
    ac.throw(ac.sequenceData, newSequenceData)
    //insert new sequence at the caret position
    output({
        sequenceData: assign({}, sequenceData, insertSequenceDataAtPosition(newSequenceData, sequenceData, caretPosition)),
        caretPosition: newSequenceData.sequence.length + caretPosition //update the caret position to be at the end of the newly inserted sequence
    })

}
var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var ac = require('ve-api-check');

export default function insertSequenceData({sequenceData, caretPosition }, tree) {
    ac.throw(ac.posInt, caretPosition)
    ac.throw(ac.sequenceData, sequenceData)

    //insert new sequence at the caret position
    // var caretPosition = tree.get('caretPosition'); //important that we get the caret position only after the deletion occurs!
    //tnr: maybe refactor the following so that it doesn't rely on caret position directly, instead just pass in the bp position as a param to a more generic function
    var oldSequenceData = tree.get('sequenceData');
    //tnr: need to handle the splitting up of a sequence
    var newSequenceData = assign({}, oldSequenceData, insertSequenceDataAtPosition(sequenceData, oldSequenceData, caretPosition));
    // console.log('sequenceData.sequence.length: ' + sequenceData.sequence.length);
    // console.log('newSequenceData.sequence.length: ' + newSequenceData.sequence.length);

    tree.set('sequenceData', newSequenceData);
    //update the caret position to be at the end of the newly inserted sequence
    tree.set('caretPosition', sequenceData.sequence.length + caretPosition);

}
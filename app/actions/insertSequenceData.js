var tree = require('../baobabTree');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var assign = require('lodash/object/assign');
var deleteSequence = require('./deleteSequence');
var setCaretPosition = require('./setCaretPosition');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');


module.exports = function insertSequenceData(sequenceDataToInsert) {
    if (!sequenceDataToInsert || !sequenceDataToInsert.sequence.length) {
        console.warn("must pass a valid sequence string");
        return;
    }
    //check for initial values
    var selectionLayer = tree.select('selectionLayer').get();

    //delete the any selected sequence
    if (selectionLayer && selectionLayer.selected && areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
        deleteSequence(selectionLayer);
    }
    //insert new sequence at the caret position
    var caretPosition = tree.select('caretPosition').get(); //important that we get the caret position only after the deletion occurs!
    if (areNonNegativeIntegers([caretPosition])) {
        //tnr: maybe refactor the following so that it doesn't rely on caret position directly, instead just pass in the bp position as a param to a more generic function
        var sequenceData = tree.select('sequenceData').get();
        //tnr: need to handle the splitting up of a sequence
        var newSequenceData = assign({}, sequenceData, insertSequenceDataAtPosition(sequenceDataToInsert, sequenceData, caretPosition));
        // console.log('sequenceData.sequence.length: ' + sequenceData.sequence.length);
        // console.log('newSequenceData.sequence.length: ' + newSequenceData.sequence.length);

        tree.select('sequenceData').set(newSequenceData);
        //update the caret position to be at the end of the newly inserted sequence
        setCaretPosition(sequenceDataToInsert.sequence.length + caretPosition);
    } else {
        console.warn('nowhere to put the inserted sequence..');
        return;
    }
}
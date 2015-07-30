var tree = require('../baobabTree');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var assign = require('lodash/object/assign');
var deleteSequence = require('./deleteSequence');
var setCaretPosition = require('./setCaretPosition');
var adjustRangeToSequenceInsert = require('../adjustRangeToSequenceInsert');
var spliceString = require('string-splice');
var validateAndTidyUpSequenceData = require('../validateAndTidyUpSequenceData');


module.exports = function insertSequenceData (sequenceDataToInsert) {
    if (!sequenceDataToInsert || !sequenceDataToInsert.sequence.length) {
        console.warn("must pass a valid sequence string");
        return;
    }
    //check for initial values
    var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();

    //delete the any selected sequence
    if (selectionLayer && selectionLayer.selected && areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
        deleteSequence(selectionLayer);
    }
    //insert new sequence at the caret position
    var caretPosition = tree.select('vectorEditorState', 'caretPosition').get(); //important that we get the caret position only after the deletion occurs!
    if (areNonNegativeIntegers([caretPosition])) {
        //tnr: maybe refactor the following so that it doesn't rely on caret position directly, instead just pass in the bp position as a param to a more generic function
        var sequenceData = tree.select('vectorEditorState', 'sequenceData').get();
        //tnr: need to handle the splitting up of a sequence
        var newSequenceData = assign({}, sequenceData, insertSequenceDataAtPosition(sequenceDataToInsert, sequenceData, caretPosition));
        // console.log('sequenceData.sequence.length: ' + sequenceData.sequence.length);
        // console.log('newSequenceData.sequence.length: ' + newSequenceData.sequence.length);
        tree.select('vectorEditorState', 'sequenceData').set(newSequenceData);
        console.log('newdata set');
        //update the caret position to be at the end of the newly inserted sequence
        setCaretPosition(sequenceDataToInsert.sequence.length + caretPosition);
    } else {
        console.warn('nowhere to put the inserted sequence..');
        return;
    }
    // this.refreshEditor(); //tnrtodo: hacky hack until baobab is fixed completely... this causes the editor to update itself..
    //insert the sequence
    // tree.select('vectorEditorState', 'selectionLayer').set({});
    // viewportDimensions.set(newSize);
    function insertSequenceDataAtPosition(sequenceDataToInsert, existingSequenceData, caretPosition) {
        sequenceDataToInsert = validateAndTidyUpSequenceData(sequenceDataToInsert);
        existingSequenceData = validateAndTidyUpSequenceData(existingSequenceData);
        var newSequenceData = validateAndTidyUpSequenceData({}); //makes a new blank sequence

        var insertLength = sequenceDataToInsert.sequence.length;
        //splice the underlying sequence
        newSequenceData.sequence = spliceString(existingSequenceData.sequence, caretPosition, 0, sequenceDataToInsert.sequence);
        newSequenceData.features = newSequenceData.features.concat(adjustAnnotationsToInsert(existingSequenceData.features, caretPosition, insertLength));
        newSequenceData.parts = newSequenceData.parts.concat(adjustAnnotationsToInsert(existingSequenceData.parts, caretPosition, insertLength));
        newSequenceData.features = newSequenceData.features.concat(adjustAnnotationsToInsert(sequenceDataToInsert.features, 0, caretPosition));
        newSequenceData.parts = newSequenceData.parts.concat(adjustAnnotationsToInsert(sequenceDataToInsert.parts, 0, caretPosition));
        return newSequenceData;
    }

    function adjustAnnotationsToInsert(annotationsToBeAdjusted, insertStart, insertLength) {
        if (!annotationsToBeAdjusted) {
            throw 'no annotations passed!';
        }
        return annotationsToBeAdjusted.map(function(annotation) {
            var newAnnotationRange = adjustRangeToSequenceInsert(annotation, insertStart, insertLength);
            if (newAnnotationRange) {
                var adjustedAnnotation = assign({}, annotation);
                adjustedAnnotation.start = newAnnotationRange.start;
                adjustedAnnotation.end = newAnnotationRange.end;
                return adjustedAnnotation;
            } else {
                throw 'no range!';
            }
        });
    }
}
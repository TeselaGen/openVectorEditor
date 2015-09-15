var adjustRangeToInsert = require('ve-range-utils/adjustRangeToInsert');
var spliceString = require('string-splice');
var tidyUpSequenceData = require('./tidyUpSequenceData');
var ac = require('ve-api-check');
module.exports = function insertSequenceDataAtPosition(sequenceDataToInsert, existingSequenceData, caretPosition) {
    // ac.throw([
    //     ac.sequenceData,
    //     ac.sequenceData,
    //     ac.posInt
    // ], arguments);
    // tnrtodo: add more validation here!
    ac.throw(ac.posInt, caretPosition);
    sequenceDataToInsert = tidyUpSequenceData(sequenceDataToInsert);

    var newSequenceData = tidyUpSequenceData({}); //makes a new blank sequence

    var insertLength = sequenceDataToInsert.sequence.length;
    //splice the underlying sequence
    newSequenceData.sequence = spliceString(existingSequenceData.sequence, caretPosition, 0, sequenceDataToInsert.sequence);
    newSequenceData.features = newSequenceData.features.concat(adjustAnnotationsToInsert(existingSequenceData.features, caretPosition, insertLength));
    newSequenceData.parts = newSequenceData.parts.concat(adjustAnnotationsToInsert(existingSequenceData.parts, caretPosition, insertLength));
    newSequenceData.translations = newSequenceData.translations.concat(adjustAnnotationsToInsert(existingSequenceData.translations, caretPosition, insertLength));
    newSequenceData.features = newSequenceData.features.concat(adjustAnnotationsToInsert(sequenceDataToInsert.features, 0, caretPosition));
    newSequenceData.parts = newSequenceData.parts.concat(adjustAnnotationsToInsert(sequenceDataToInsert.parts, 0, caretPosition));
    newSequenceData.translations = newSequenceData.translations.concat(adjustAnnotationsToInsert(sequenceDataToInsert.translations, 0, caretPosition));
    // ac.throw(ac.sequenceData, newSequenceData) //tnr: passing it through this check before returning just to make sure everything is still okay
    return newSequenceData;
}

function adjustAnnotationsToInsert(annotationsToBeAdjusted, insertStart, insertLength) {
    ac.throw([ac.arrayOf(ac.range), ac.posInt, ac.posInt], arguments)
    return annotationsToBeAdjusted.map(function(annotation) {
        return adjustRangeToInsert(annotation, insertStart, insertLength);
    });
}
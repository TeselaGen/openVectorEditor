var ObjectID = require("bson-objectid");
var assign = require('lodash/object/assign');
var filterSequenceString = require('ve-sequence-utils/filterSequenceString');

export default function pasteSequenceString({input: {sequenceString}, state, output}) {
    var clipboardData = state.get('clipboardData');
    var cleanedUpClipboardData;

    function generateNewIdsForSequenceAnnotations(sequenceData) {
        return assign({}, sequenceData, {
            features: generateNewIdsForAnnotations(sequenceData.features),
            parts: generateNewIdsForAnnotations(sequenceData.parts)
        });
    }

    function generateNewIdsForAnnotations(annotations) {
        return annotations.map(function(annotation) {
            return assign({}, annotation, {
                id: ObjectID().str
            });
        });
    }

    if (clipboardData && clipboardData.sequence || clipboardData.sequence === sequenceString) {
        // handle clipboardData which was copied from within the app
        // assign clipboardData annotations new ids
        cleanedUpClipboardData = generateNewIdsForSequenceAnnotations(clipboardData);
    } else {
        // clean up the sequence string coming from elsewhere so we can insert it
        cleanedUpClipboardData = filterSequenceString(sequenceString);
    }

    if(cleanedUpClipboardData.length > 0) {
        output.success({'newSequenceData': cleanedUpClipboardData})
    } else {
        output.error()
    }
}
var ObjectID = require("bson-objectid");
var assign = require('lodash/object/assign');
var filterSequenceString = require('ve-sequence-utils/filterSequenceString');

export default function pasteSequenceString({input, state, output}) {
    var clipboardData = state.get('clipboardData');
    var cleanedUpClipboardData;
    var { sequenceString } = input;

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

    // console.log("starting input string: " + sequenceString);
    // console.log("starting clipboard data: " + clipboardData.sequence);

    if (clipboardData && clipboardData.sequence && clipboardData.sequence === sequenceString) {
        // handle clipboardData which was copied from within the app
        // assign clipboardData annotations new ids
        cleanedUpClipboardData = generateNewIdsForSequenceAnnotations(clipboardData);
        // console.log(">>>> data was copied from inside the editor");
    } else {
        // clean up the sequence string coming from elsewhere so we can insert it
        cleanedUpClipboardData = filterSequenceString(sequenceString);
        // console.log(">>>> data is from outside the editor");
    }

    // console.log("clipboard data is clean: " + cleanedUpClipboardData);
    if(cleanedUpClipboardData.sequence) {
        output.success({'newSequenceData': cleanedUpClipboardData})
    } else {
        output.error("clipboard data not found or invalid")
    }
}
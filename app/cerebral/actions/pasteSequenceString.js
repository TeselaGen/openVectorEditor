// var ObjectID = require("bson-objectid");
var assign = require('lodash/object/assign');
var filterSequenceString = require('ve-sequence-utils/filterSequenceString');

export default function pasteSequenceString({input, state, output}) {
    var clipboardData = state.get('clipboardData');
    var cleanedUpClipboardData;
    var { sequenceString } = input;

    function removeFeatureIds(sequenceData) {
        return assign({}, sequenceData, {
            features: removeIds(sequenceData.features)
        });
    }

    // // {{}} delete id instead of putting anything there, remove entirely
    function removeIds(annotations) {
        return annotations.map(function(annotation) {
            delete annotation._id;
        });
    }

    if (clipboardData && clipboardData.sequence && clipboardData.sequence === sequenceString) {
        // handle clipboardData which was copied from within the app
        // remove ids from the copied features so the server can give them new ones
        // cleanedUpClipboardData = removeFeatureIds(clipboardData);
        cleanedUpClipboardData = clipboardData;
    } else {
        // clean up the sequence string coming from elsewhere so we can insert it
        cleanedUpClipboardData = filterSequenceString(sequenceString);
    }

    if(cleanedUpClipboardData.sequence) {
        output.success({'newSequenceData': cleanedUpClipboardData})
    } else {
        output.error("clipboard data not found or invalid")
    }
}
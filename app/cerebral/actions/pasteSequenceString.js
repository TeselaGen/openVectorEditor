var assign = require('lodash/object/assign');
var filterSequenceString = require('ve-sequence-utils/filterSequenceString');

export default function pasteSequenceString({input, state, output}) {
    var clipboardData = state.get('clipboardData');
    var cleanedUpClipboardData;
    var { sequenceString } = input;

    // delete id instead of putting anything there, remove entirely
    function removeIds(annotations) {
        var newFeature;
        return annotations.map(function(annotation) {
            newFeature = assign({}, annotation);
            delete newFeature.id;
            return newFeature;
        });
    }

    function removeFeatureIds(sequenceData) {
        return assign({}, sequenceData, {
            features: removeIds(sequenceData.features)
        });
    }

    if (clipboardData && clipboardData.sequence /*&& clipboardData.sequence === sequenceString*/) {
        // handle clipboardData which was copied from within the app
        // remove ids from the copied features so the server can give them new ones
        cleanedUpClipboardData = removeFeatureIds(clipboardData);
    } else {
        // clean up the sequence string coming from elsewhere so we can insert it
        cleanedUpClipboardData = assign({}, {sequence: filterSequenceString(sequenceString)});
    }

    if(cleanedUpClipboardData.sequence) {
        output.success({'newSequenceData': cleanedUpClipboardData})
    } else {
        output.error("clipboard data not found or invalid")
    }
}
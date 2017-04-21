var assign = require('lodash/object/assign');
var filterSequenceString = require('ve-sequence-utils/filterSequenceString');

export default function pasteSequenceString({input, state, output}) {
    debugger
    var clipboardData = state.get('clipboardData');
    if (!clipboardData) {
        output.error({errMessage: "clipboard data not found or invalid"});
        return;
    }

    var cleanedUpClipboardData;
    var sequenceString = clipboardData.sequence;

    // delete id instead of putting anything there, remove entirely
    function removeIds(annotations) {
        var newFeature;
        return annotations.map(function(annotation) {
            newFeature = assign({}, annotation);
            delete newFeature.id;
            return newFeature;
        });
    }

    function removeFeatureIds() {
        return assign({}, clipboardData, {
            features: removeIds(clipboardData.features)
        });
    }

    if (clipboardData && clipboardData.sequence /*&& clipboardData.sequence === sequenceString*/) {
        // handle clipboardData which was copied from within the app
        // remove ids from the copied features so the server can give them new ones
        cleanedUpClipboardData = removeFeatureIds();
    } else {
        // clean up the sequence string coming from elsewhere so we can insert it
        cleanedUpClipboardData = assign({}, {sequence: filterSequenceString(sequenceString)});
    }

    if(cleanedUpClipboardData.sequence) {
        output.success({'newSequenceData': cleanedUpClipboardData})
    } else {
        output.error({errMessage: "clipboard data not found or invalid"});
    }
}

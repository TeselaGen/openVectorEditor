var assign = require('lodash/object/assign');
var filterSequenceString = require('ve-sequence-utils/filterSequenceString');

export default function pasteSequenceString({input, state, output}) {
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

    var sequenceString;
    var clipboardData = state.get('clipboardData');
    var cleanedUpClipboardData;

    // something external has been copied to the computer's clipboard more recently
    // than whatever was copied in-app, so use external computer's clipboard data
    if (clipboardData.sequence && input.selection && clipboardData.sequence !== input.selection) {
        sequenceString = input.selection;
        cleanedUpClipboardData = assign({}, {sequence: filterSequenceString(sequenceString)});

    // the in-app clipboard is the most recent, so use in-app clipboard data
    } else if (clipboardData.sequence) {
        sequenceString = clipboardData.sequence;
        cleanedUpClipboardData = removeFeatureIds();

    // no in-app data exists, so use external computer's clipboard data
    } else if (input.selection) {
        sequenceString = input.selection;
        cleanedUpClipboardData = assign({}, {sequence: filterSequenceString(sequenceString)});
    }

    if(cleanedUpClipboardData && cleanedUpClipboardData.sequence) {
        output.success({'newSequenceData': cleanedUpClipboardData})
    } else {
        output.error({errMessage: "clipboard data not found or invalid"});
    }
}

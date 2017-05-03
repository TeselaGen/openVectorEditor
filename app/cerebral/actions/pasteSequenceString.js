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

    if (clipboardData.sequence && input.selection && clipboardData.sequence !== input.selection) {
        sequenceString = input.selection;
        cleanedUpClipboardData = assign({}, {sequence: filterSequenceString(sequenceString)});
    } else if (clipboardData.sequence) {
        sequenceString = clipboardData.sequence;
        cleanedUpClipboardData = removeFeatureIds();
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

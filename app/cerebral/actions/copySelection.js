var assign = require('lodash/object/assign');
var getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('ve-range-utils/collapseOverlapsGeneratedFromRangeComparisonIfPossible');
var getSubstringByRange = require('get-substring-by-range');

export default function copySelection({input, state, output}) {
    var { selectionLayer, sequenceData } = state.get();
    var allowPartialAnnotationsOnCopy = state.get('allowPartialAnnotationsOnCopy');
    var selectionStart = undefined;
    var selectionEnd = undefined;

    function copyRangeOfSequenceData(sequenceData, rangeToCopy, allowPartialAnnotationsOnCopy) {
        selectionStart = rangeToCopy.start;
        selectionEnd = rangeToCopy.end;
        var newSequenceData = {};
        newSequenceData.sequence = getSubstringByRange(sequenceData.sequence, rangeToCopy);
        newSequenceData.features = copyAnnotationsByRange(sequenceData.features, rangeToCopy, sequenceData.sequence.length);
        newSequenceData.parts = copyAnnotationsByRange(sequenceData.parts, rangeToCopy, sequenceData.sequence.length);

        function copyAnnotationsByRange(annotations, rangeToCopy, sequenceLength) {
            var copiedAnnotations = [];
            annotations.forEach(function(annotation) {
                var overlaps = getOverlapsOfPotentiallyCircularRanges(annotation, rangeToCopy, sequenceLength);
                var collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible(overlaps, sequenceLength);
                if (!allowPartialAnnotationsOnCopy) {
                    //filter out any annotations that aren't whole
                    collapsedOverlaps = collapsedOverlaps.filter(function(overlap) {
                        return (overlap.start === annotation.start && overlap.end === annotation.end);
                    });
                }
                if (collapsedOverlaps.length > 1) {
                    console.log('splitting annotation on copy!');
                }
                collapsedOverlaps.forEach(function(collapsedOverlap) {
                    //shift the collapsedOverlaps by the rangeToCopy start if necessary
                    var collapsedAndShiftedOverlap = shiftCopiedOverlapByRange(collapsedOverlap, rangeToCopy, sequenceLength);
                    copiedAnnotations.push(assign({}, annotation, collapsedAndShiftedOverlap));
                });
            });
            return copiedAnnotations;
        }
        return assign({}, sequenceData, newSequenceData); //merge any other properties that exist in sequenceData into newSequenceData
    }

    function shiftCopiedOverlapByRange(copiedOverlap, rangeToCopy, sequenceLength) {
        var end = copiedOverlap.end - rangeToCopy.start;
        if (end < 0) {
            end += sequenceLength - 1;
        }
        var start = copiedOverlap.start - rangeToCopy.start;
        if (start < 0) {
            start += sequenceLength - 1;
        }
        return {
            start: start,
            end: end
        };
    }

    if (selectionLayer.selected) { // copy the whole sequence data + selected feature
        let selectionData = copyRangeOfSequenceData(sequenceData, selectionLayer, allowPartialAnnotationsOnCopy);
        let newClipboardData = JSON.parse(JSON.stringify(sequenceData));

        newClipboardData.selectedFeatures = [];
        if (selectionData.features.length != 0) {
            let selectionFeatures = selectionData.features;
            for (var i = 0; i < selectionFeatures.length; i++) {
                let newFeature = {name: selectionFeatures[i].name, id: selectionFeatures[i].id, forward: selectionFeatures[i].forward, type: selectionFeatures[i].type,
                    genbankStartBP: selectionFeatures[i].locations[0].genbankStart, endBP: selectionFeatures[i].locations[0].end,
                    sequence: selectionData.sequence};
                newClipboardData.selectedFeatures.push(newFeature);
            }
        }

        newClipboardData.revComp = false;
        newClipboardData.genbankStartBP = selectionStart;
        newClipboardData.endBP = selectionEnd;
        newClipboardData.subsequence = selectionData.sequence;

        // delete newClipboardData["translations"];
        // delete newClipboardData["orfs"];
        // delete newClipboardData["cutsites"];
        // delete newClipboardData["parts"];

        console.log(newClipboardData);
        output.success({'clipboardData': newClipboardData});
        // output.success({'clipboardData': copyRangeOfSequenceData(sequenceData, selectionLayer, allowPartialAnnotationsOnCopy)})
    } else {
        output.error();
    }
}
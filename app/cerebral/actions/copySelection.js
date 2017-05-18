var assign = require('lodash/object/assign');
var getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('ve-range-utils/collapseOverlapsGeneratedFromRangeComparisonIfPossible');
var getSubstringByRange = require('get-substring-by-range');

export default function copySelection({input, state, output}) {
    var { selectionLayer, sequenceData } = state.get();
    var allowPartialAnnotationsOnCopy = state.get('allowPartialAnnotationsOnCopy');
    var selectionStart = selectionLayer.start;
    var selectionEnd = selectionLayer.end;

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

    if (selectionLayer.selected) { // copy the whole sequence data + selected features
        let selectionData = copyRangeOfSequenceData(sequenceData, selectionLayer, allowPartialAnnotationsOnCopy);

        var url = window.location.origin + "\/entry\/";
        var indEntry = window.location.search.indexOf("entryId");
        var indSession = window.location.search.indexOf("sessionId");
        url += window.location.search.slice(indEntry + 8, indSession - 1);

        var newClipboardData = {
            allFeatures: sequenceData.features,
            features: selectionData.features,
            genbankStartBP: selectionStart,
            name: sequenceData.name,
            circular: sequenceData.circular,
            endBP: selectionEnd,
            _id: sequenceData._id,
            fullSequence: sequenceData.sequence,
            sequence: selectionData.sequence,
            url: url,
        };

        state.set('clipboardData', newClipboardData);
    } else {
        state.set('clipboardData', {})
    }
}

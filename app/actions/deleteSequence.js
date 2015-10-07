var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var adjustRangeToDeletionOfAnotherRange = require('ve-range-utils/adjustRangeToDeletionOfAnotherRange');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');
var assign = require('lodash/object/assign');

export default function deleteSequence({selectionLayer}, tree, output) {
    if (!selectionLayer || !areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
        throw new Error('can\'t delete sequence due to invalid start and end');
        // return;
    }
    var sequenceLength = tree.get(['sequenceLength']);
    // var deletionLength;
    // if (selectionLayer.start > selectionLayer.end) {
    //     deletionLength = sequenceLength - selectionLayer.start + selectionLayer.end + 1;
    // } else {
    //     deletionLength = selectionLayer.end - selectionLayer.start + 1;
    // }
    // var selectionLayer = tree.get('selectionLayer');
    //update selection layer due to sequence deletion
    // if (selectionLayer && selectionLayer.selected && areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
    //     var newSelectionLayerRange = adjustRangeToDeletionOfAnotherRange(selectionLayer, selectionLayer, sequenceLength);
    //     if (newSelectionLayerRange) {
    //         output.selectionLayer(newSelectionLayerRange);
    //     } else {
    //         output.selectionLayer(false);
    //         //update the cursor
    //         if (selectionLayer.start > selectionLayer.end) {
    //             setCaretPosition(selectionLayer.start - selectionLayer.end - 1);
    //         } else {
    //             setCaretPosition(selectionLayer.start);
    //         }
    //     }
    // } else if (tree.get(['caretPosition'])) {
        //update the cursor position
        //
    var newCaretPosition = selectionLayer.start;
    if (selectionLayer.start > selectionLayer.end) {
        newCaretPosition = selectionLayer.start - selectionLayer.end - 1;
    }
    tree.set(['caretPosition'], newCaretPosition);
    // output.success({caretPosition})
    // } else {
    //     // throw new Error('must have a selection layer or a caretPosition');
    //     console.warn('must have a selection layer or a caretPosition');
    // }
    var sequenceData = tree.get(['sequenceData']);
    var newSequenceData = {};
    if (sequenceData.sequence) {
        //splice the underlying sequence
        if (selectionLayer.start > selectionLayer.end) {
            //circular deletion
            newSequenceData.sequence = sequenceData.sequence.slice(selectionLayer.end + 1, selectionLayer.start);
        } else {
            //regular deletion
            newSequenceData.sequence = sequenceData.sequence.slice(0, selectionLayer.start) + sequenceData.sequence.slice(selectionLayer.end + 1, sequenceLength);
        }
    }
    //trim and remove features
    newSequenceData.features = applyDeleteToAnnotations(sequenceData.features);
    newSequenceData.parts = applyDeleteToAnnotations(sequenceData.parts);
    newSequenceData.translations = applyDeleteToAnnotations(sequenceData.translations);

    function applyDeleteToAnnotations(annotations) {
        if (annotations) {
            return annotations.map(function(annotation) {
                var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, selectionLayer, sequenceLength);
                if (newAnnotationRange) {
                    var adjustedAnnotation = assign({}, annotation);
                    adjustedAnnotation.start = newAnnotationRange.start;
                    adjustedAnnotation.end = newAnnotationRange.end;
                    return adjustedAnnotation;
                }
            }).filter(function(annotation) { //strip out deleted (null) annotations
                if (annotation) {
                    return true;
                }
            });
        } else {
            return [];
        }
    }
    tree.set('sequenceData', tidyUpSequenceData(newSequenceData, true));
}

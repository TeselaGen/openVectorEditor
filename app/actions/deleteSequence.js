var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var adjustRangeToDeletionOfAnotherRange = require('ve-range-utils/adjustRangeToDeletionOfAnotherRange');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');
var assign = require('lodash/object/assign');
var setCaretPosition = require('./setCaretPosition');
var setSelectionLayer = require('./setSelectionLayer');

export default function deleteSequence({rangeToDelete}, tree, output) {
    if (!rangeToDelete || !areNonNegativeIntegers([rangeToDelete.start, rangeToDelete.end])) {
        console.warn('can\'t delete sequence due to invalid start and end');
    }
    var sequenceLength = tree.get(['sequenceLength']);
    var deletionLength;
    if (rangeToDelete.start > rangeToDelete.end) {
        deletionLength = sequenceLength - rangeToDelete.start + rangeToDelete.end + 1;
    } else {
        deletionLength = rangeToDelete.end - rangeToDelete.start + 1;
    }
    var selectionLayer = tree.get('selectionLayer');
    //update selection layer due to sequence deletion
    if (selectionLayer && selectionLayer.selected && areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
        var newSelectionLayerRange = adjustRangeToDeletionOfAnotherRange(selectionLayer, rangeToDelete, sequenceLength);
        if (newSelectionLayerRange) {
            setSelectionLayer(newSelectionLayerRange);
        } else {
            setSelectionLayer(false);
            //update the cursor
            if (rangeToDelete.start > rangeToDelete.end) {
                setCaretPosition(rangeToDelete.start - rangeToDelete.end - 1);
            } else {
                setCaretPosition(rangeToDelete.start);
            }
        }
    } else if (tree.get(['caretPosition'])) {
        //update the cursor position
        if (rangeToDelete.start > rangeToDelete.end) {
            setCaretPosition(rangeToDelete.start - rangeToDelete.end - 1);
        } else {
            setCaretPosition(rangeToDelete.start);
        }
    } else {
        // throw new Error('must have a selection layer or a caretPosition');
        console.warn('must have a selection layer or a caretPosition');
    }
    var sequenceData = tree.get(['sequenceData']);
    var newSequenceData = {};
    if (sequenceData.sequence) {
        //splice the underlying sequence
        if (rangeToDelete.start > rangeToDelete.end) {
            //circular deletion
            newSequenceData.sequence = sequenceData.sequence.slice(rangeToDelete.end + 1, rangeToDelete.start);
        } else {
            //regular deletion
            newSequenceData.sequence = sequenceData.sequence.slice(0, rangeToDelete.start) + sequenceData.sequence.slice(rangeToDelete.end + 1, sequenceLength);
        }
    }
    //trim and remove features
    newSequenceData.features = applyDeleteToAnnotations(sequenceData.features);
    newSequenceData.parts = applyDeleteToAnnotations(sequenceData.parts);
    newSequenceData.translations = applyDeleteToAnnotations(sequenceData.translations);
    function applyDeleteToAnnotations(annotations) {
        if (annotations) {
            return annotations.map(function(annotation) {
                var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, rangeToDelete, sequenceLength);
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
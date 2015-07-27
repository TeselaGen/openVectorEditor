var tree = require('../baobabTree');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var adjustRangeToDeletionOfAnotherRange = require('../adjustRangeToDeletionOfAnotherRange');
var assign = require('lodash/object/assign');

module.exports = function deleteSequence(rangeToDelete) {
    if (!rangeToDelete || !areNonNegativeIntegers([rangeToDelete.start, rangeToDelete.end])) {
        console.warn('can\'t delete sequence due to invalid start and end');
    }
    var sequenceLength = tree.get(['$sequenceLength']);
    var deletionLength;
    if (rangeToDelete.start > rangeToDelete.end) {
        deletionLength = sequenceLength - rangeToDelete.start + rangeToDelete.end + 1;
    } else {
        deletionLength = rangeToDelete.end - rangeToDelete.start + 1;
    }
    var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
    //update selection layer due to sequence deletion
    if (selectionLayer && selectionLayer.selected && areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
        var newSelectionLayerRange = adjustRangeToDeletionOfAnotherRange(selectionLayer, rangeToDelete, sequenceLength);
        if (newSelectionLayerRange) {
            this.setSelectionLayer(newSelectionLayerRange);
        } else {
            this.setSelectionLayer(false);
            //update the cursor
            if (rangeToDelete.start > rangeToDelete.end) {
                this.setCaretPosition(rangeToDelete.start - rangeToDelete.end - 1);
            } else {
                this.setCaretPosition(rangeToDelete.start);
            }
        }
    } else if (tree.select('vectorEditorState', 'caretPosition').get()) {
        //update the cursor position
        if (rangeToDelete.start > rangeToDelete.end) {
            this.setCaretPosition(rangeToDelete.start - rangeToDelete.end - 1);
        } else {
            this.setCaretPosition(rangeToDelete.start);
        }
        // this.setCaretPosition(tree.select('vectorEditorState', 'caretPosition').get() - rangeToDelete.start);
    } else {
        throw 'must have a selection layer or a caretPosition';
        // console.warn('must have a selection layer or a caretPosition');
    }
    var sequenceData = tree.select('vectorEditorState', 'sequenceData').get();
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
    if (sequenceData.features) {
        newSequenceData.features = sequenceData.features.map(function(annotation) {
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
    }
    if (sequenceData.parts) {
        newSequenceData.parts = sequenceData.parts.map(function(annotation) {
            var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, rangeToDelete);
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
    }
    // console.log('sequenceData.sequence.length: ' + sequenceData.sequence.length);
    // console.log('newSequenceData.sequence.length: ' + newSequenceData.sequence.length);
    tree.select('vectorEditorState', 'sequenceData').set(newSequenceData);
    // this.refreshEditor(); //tnrtodo: hacky hack until baobab is fixed completely... this causes the editor to update itself..
}
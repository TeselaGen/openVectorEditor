import ac from 've-api-check'; 
import adjustRangeToDeletionOfAnotherRange from 've-range-utils/adjustRangeToDeletionOfAnotherRange';
import tidyUpSequenceData from 've-sequence-utils/tidyUpSequenceData';
import assign from 'lodash/object/assign';

export default function deleteSequence({selectionLayer, sequenceData}, tree, output) {
    ac.throw(ac.range, selectionLayer)
    var newCaretPosition = selectionLayer.start;
    if (selectionLayer.start > selectionLayer.end) {
        newCaretPosition = selectionLayer.start - selectionLayer.end - 1;
    }
    var newSequenceData = {};
    if (sequenceData.sequence) {
        //splice the underlying sequence
        if (selectionLayer.start > selectionLayer.end) {
            //circular deletion
            newSequenceData.sequence = sequenceData.sequence.slice(selectionLayer.end + 1, selectionLayer.start);
        } else {
            //regular deletion
            newSequenceData.sequence = sequenceData.sequence.slice(0, selectionLayer.start) + sequenceData.sequence.slice(selectionLayer.end + 1, sequenceData.sequence.length);
        }
    }
    //trim and remove features
    newSequenceData.features = applyDeleteToAnnotations(sequenceData.features);
    newSequenceData.parts = applyDeleteToAnnotations(sequenceData.parts);
    newSequenceData.translations = applyDeleteToAnnotations(sequenceData.translations);

    function applyDeleteToAnnotations(annotations) {
        if (annotations) {
            return annotations.map(function(annotation) {
                var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, selectionLayer, sequenceData.sequence.length);
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
    output({sequenceData: tidyUpSequenceData(newSequenceData, true), caretPosition: newCaretPosition});
}

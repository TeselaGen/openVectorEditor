import ac from 've-api-check';
import areNonNegativeIntegers from 'validate.io-nonnegative-integer-array';
import isBoolean from 'validate.io-boolean';

export default function addAnnotations({annotationType, annotationsToInsert, throwErrors}, state, output) {
    ac.throw(ac.annotationType, annotationType);
    ac.throw(ac.arrayOf(ac.range), annotationsToInsert);
    ac.throw(ac.bool.optional, throwErrors);
    
    var annotationsCursor = state.select('sequenceData', annotationType);
    annotationsToInsert.forEach(function(annotationToInsert) {
        if (!isBoolean(annotationToInsert.forward)) {
            if (throwErrors) {
                throw new Error('annotation direction not specified')
            } else {
                console.log('annotation direction not specified')
                annotationToInsert.forward = true;
            }
        }
        if (!areNonNegativeIntegers([annotationToInsert.start])) {
            if (throwErrors) {
                throw new Error('annotation position not specified')
            } else {
                console.log('annotation position not specified')
                annotationToInsert.start = 0;
            }
        }
        if (!areNonNegativeIntegers([annotationToInsert.end])) {
            if (throwErrors) {
                throw new Error('annotation position not specified')
            } else {
                console.log('annotation position not specified')
                annotationToInsert.end = 0;
            }
        }
        annotationsCursor.push(annotationToInsert);
    });
}
var ac = require('ve-api-check');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var isBoolean = require('validate.io-boolean');

export default function addAnnotations({annotationType, annotationsToInsert, throwErrors}, state, output) {
    ac.warn(ac.annotationType, annotationType);
    ac.warn(ac.arrayOf(ac.range), annotationsToInsert);
    ac.warn(ac.bool.optional, throwErrors);
    
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
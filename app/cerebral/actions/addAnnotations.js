var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var isBoolean = require('validate.io-boolean');

export default function addAnnotations({input: {sidebarType, annotationsToInsert, throwErrors}, state, output}) {

    annotationsToInsert.forEach(function(annotationToInsert) {
        if (!isBoolean(annotationToInsert.forward)) {
            if (annotationToInsert.strand == null) {
                if (throwErrors) {
                    throw new Error('error: annotation direction not specified')
                } else {
                    console.log('annotation direction not specified')
                    annotationToInsert.forward = true;
                }
            } else {
                (annotationToInsert.strand < 0) ? annotationToInsert.forward = false : annotationToInsert.forward = true;
            }
        }
        if (!areNonNegativeIntegers([annotationToInsert.start])) {
            if (annotationToInsert.start == null) {
                if (throwErrors) {
                    throw new Error('error: annotation position not specified')
                } else {
                    console.log('annotation position not specified')
                    annotationToInsert.start = 0;
                }
            } else {
                annotationToInsert.start = parseInt(annotationToInsert.start);
            }

        }
        if (!areNonNegativeIntegers([annotationToInsert.end])) {
            if (annotationToInsert.start == null) {
                if (throwErrors) {
                    throw new Error('error: annotation position not specified')
                } else {
                    console.log('annotation position not specified')
                    annotationToInsert.end = 0;
                }
            } else {
                annotationToInsert.end = parseInt(annotationToInsert.end);
            }
        }

        // delete annotationToInsert.id;
        // hardcoding features for now because it's the only thing we can update
        state.push(['sequenceData', 'features'], annotationToInsert);
    });
}

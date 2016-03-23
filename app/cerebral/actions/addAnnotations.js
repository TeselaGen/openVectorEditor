var ac = require('ve-api-check');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var isBoolean = require('validate.io-boolean');

// import ObjectID from 'bson-objectid';

export default function addAnnotations({input: {annotationType, annotationsToInsert, throwErrors}, state, output}) {
    ac.throw(ac.annotationType, annotationType);
    ac.throw(ac.arrayOf(ac.range), annotationsToInsert);
    ac.throw(ac.bool.optional, throwErrors);
    
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

        delete annotationToInsert.id;

        // if (annotationToInsert.id === undefined) {
        //     annotationToInsert.id = ObjectID().str;
        // }

        state.push(['sequenceData', annotationType], annotationToInsert);
    });
}

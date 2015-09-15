var ac = require('ve-api-check');
// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
var tree = require('../baobabTree');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var isBoolean = require('validate.io-boolean');

module.exports = function addAnnotations(annotationType, annotationsToInsert, throwErrors) {
    ac.throw([ac.annotationType, ac.arrayOf(ac.range), ac.bool.optional], arguments);
    
    var annotationsCursor = tree.select('sequenceData', annotationType);
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
};
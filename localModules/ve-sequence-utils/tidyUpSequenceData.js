// tnrtodo: figure out where to insert this validation exactly..
var bsonObjectid = require('bson-objectid');
var assign = require('lodash/assign');
var randomColor = require('randomcolor');
var FeatureTypes = require('./FeatureTypes.js');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
module.exports = function tidyUpSequenceData(sequence, options) {
    var sequenceData = assign({}, sequence); //sequence is usually immutable, so we clone it and return it
    var response = {
        messages: []
    };
    if (!sequenceData) {
        sequenceData = {};
    }
    if (!sequenceData.sequence && sequenceData.sequence !== '') {
        sequenceData.sequence = "";
    }
    sequenceData.size = sequenceData.sequence.length;
    if (sequenceData.circular === 'false' || sequenceData.circular == -1 || !sequenceData.circular) {
        sequenceData.circular = false;
    } else {
        sequenceData.circular = true;
    }
    if (!Array.isArray(sequenceData.features)) {
        sequenceData.features = [];
    }
    if (!Array.isArray(sequenceData.parts)) {
        sequenceData.parts = [];
    }
    if (!Array.isArray(sequenceData.translations)) {
        sequenceData.translations = [];
    }
    if (!Array.isArray(sequenceData.cutsites)) {
        sequenceData.cutsites = [];
    }
    if (!Array.isArray(sequenceData.orfs)) {
        sequenceData.orfs = [];
    }

    sequenceData.features = sequenceData.features.filter(cleanUpAnnotation);
    sequenceData.parts = sequenceData.parts.filter(cleanUpAnnotation);
    sequenceData.translations = sequenceData.translations.filter(cleanUpAnnotation);

    return sequenceData;

    function cleanUpAnnotation(annotation) {
        if (!annotation || typeof annotation !== 'object') {
            response.messages.push('Invalid annotation detected and removed');
            return false;
        }
        annotation.start = parseInt(annotation.start);
        annotation.end = parseInt(annotation.end);

        if (!annotation.name || typeof annotation.name !== 'string') {
            response.messages.push('Unable to detect valid name for annotation, setting name to "Untitled annotation"');
            annotation.name = 'Untitled annotation';
        }
        if (!annotation.id && annotation.id !== 0) {
            annotation.id = bsonObjectid().str;
            response.messages.push('Unable to detect valid ID for annotation, setting ID to ' + annotation.id);
        }
        if (!areNonNegativeIntegers([annotation.start]) || annotation.start > sequenceData.size - 1) {
            response.messages.push('Invalid annotation start: ' + annotation.start + ' detected for ' + annotation.name + ' and set to 1'); //setting it to 0 internally, but users will see it as 1
            annotation.start = 0;
        }
        if (!areNonNegativeIntegers([annotation.end]) || annotation.end > sequenceData.size - 1) {
            response.messages.push('Invalid annotation end:  ' + annotation.end + ' detected for ' + annotation.name + ' and set to 1'); //setting it to 0 internally, but users will see it as 1
            annotation.end = 0;
        }
        if (annotation.start > annotation.end && sequenceData.circular === false) {
            response.messages.push('Invalid circular annotation detected for ' + annotation.name + '. end set to 1'); //setting it to 0 internally, but users will see it as 1
            annotation.end = 0;
        }
        if (!annotation.color) {
            annotation.color = randomColor();
        }

        if (annotation.forward === true || annotation.forward === 'true' || annotation.strand === 1 || annotation.strand === '1' || annotation.strand === '+') {
            annotation.forward = true;
        } else {
            annotation.forward = false;
        }

        if (!annotation.type || typeof annotation.type !== 'string' || FeatureTypes.some(function(featureType) {
            if (featureType.toLowerCase === annotation.type.toLowerCase()) {
                annotation.type = featureType; //this makes sure the annotation.type is being set to the exact value of the accepted featureType
                return true;
            }
        })) {
            response.messages.push('Invalid annotation type detected:  ' + annotation.type + ' for ' + annotation.name + '. set type to misc_feature');
            annotation.type = 'misc_feature';
        }
        return true;
    }
};

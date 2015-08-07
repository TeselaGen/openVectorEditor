// tnrtodo: figure out where to insert this validation exactly..
var assign = require('lodash/object/assign');
var randomColor = require('random-color');
var FeatureTypes = require('./FeatureTypes.js');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
module.exports = function validateAndTidyUpSequenceData(sequence) {
  var sequenceData = assign({}, sequence); //sequence is usually immutable, so we clone it and return it
  var response = {
    messages: []
  };
  if (!sequenceData) {
    console.warn('no sequenceData at all...!');
    sequenceData = {};
  }
  if (!sequenceData.sequence) {
    console.warn('no bps!');
    sequenceData.sequence = "";
  }
  // if (!sequenceData.size) {
  sequenceData.size = sequenceData.sequence.length;
  // }
  if (sequenceData.circular === 'false' || sequenceData.circular == -1 || !sequenceData.circular) {
    sequenceData.circular = false;
  } else {
    sequenceData.circular = true;
  }
  if (!Array.isArray(sequenceData.features)) {
    console.warn('no features array!');
    sequenceData.features = [];
  }
  if (!Array.isArray(sequenceData.parts)) {
    console.warn('no parts array!');
    sequenceData.parts = [];
  }
  if (!Array.isArray(sequenceData.features)) {
    console.warn('no parts array!');
    sequenceData.features = [];
  }
  sequenceData.features = sequenceData.features.filter(cleanUpAnnotation);

  sequenceData.parts = sequenceData.parts.filter(cleanUpAnnotation);
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
      annotation.color = randomColor()
    }
    annotation.strand = parseInt(annotation.strand);
    if (annotation.strand === -1 || annotation.strand === false || annotation.strand === 'false' || annotation.strand === '-') {
      annotation.strand = -1;
    } else {
      annotation.strand = 1;
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
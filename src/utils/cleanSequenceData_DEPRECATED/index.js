// TNR DEPRECATED!!!!!
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
// DEPRECATED
import { featureColors } from "ve-sequence-utils";
import arrayToObjWithIds from "./arrayToObjWithIds";

// TODO: figure out where to insert this validation exactly..
import bsonObjectid from "bson-objectid";

import assign from "lodash/assign";
// import randomColor from "randomcolor";
import areNonNegativeIntegers from "validate.io-nonnegative-integer-array";
import { userDefinedTypes, getSingular } from "../annotationTypes";

function cleanSequenceData(seqData, options = {}) {
  let sequenceData = assign({}, seqData); //sequence is usually immutable, so we clone it and return it
  let response = {
    messages: [],
    errors: []
  };
  if (!sequenceData) {
    sequenceData = {};
  }
  if (!sequenceData.sequence && sequenceData.sequence !== "") {
    sequenceData.sequence = "";
  }
  sequenceData.size = sequenceData.sequence.length;
  if (
    sequenceData.circular === "false" ||
    /* eslint-disable */

    sequenceData.circular == -1 ||
    /* eslint-enable */

    !sequenceData.circular
  ) {
    sequenceData.circular = false;
  } else {
    sequenceData.circular = true;
  }

  userDefinedTypes.forEach(function(annotationType) {
    let annotations = sequenceData[annotationType];
    if (typeof annotations !== "object") {
      annotations = {};
    }
    if (Array.isArray(annotations)) {
      annotations = arrayToObjWithIds(annotations);
    }
    let newAnnotations = {};
    Object.keys(annotations).forEach(function(key) {
      let annotation = annotations[key];
      let cleanedAnnotation = cleanUpAnnotation(
        annotation,
        options,
        annotationType
      );
      if (cleanedAnnotation) {
        newAnnotations[cleanedAnnotation.id] = {
          ...cleanedAnnotation,
          annotationType: getSingular(annotationType)
        };
      }
    });
    sequenceData[annotationType] = newAnnotations;
  });
  if (options.logMessages) {
    console.info(response.messages);
  }

  return sequenceData;

  function cleanUpAnnotation(annotation, options, annotationType) {
    if (!annotation || typeof annotation !== "object") {
      response.messages.push("Invalid annotation detected and removed");
      return false;
    }
    annotation.start = parseInt(annotation.start, 10);
    annotation.end = parseInt(annotation.end, 10);

    if (!annotation.name || typeof annotation.name !== "string") {
      response.messages.push(
        'Unable to detect valid name for annotation, setting name to "Untitled annotation"'
      );
      annotation.name = "Untitled annotation";
    }

    if (!annotation.id && annotation.id !== 0) {
      annotation.id = bsonObjectid().str;
      response.messages.push(
        "Unable to detect valid ID for annotation, setting ID to " +
          annotation.id
      );
    }
    annotation.id = annotation.id.toString();
    if (annotation.id.indexOf("_&&_") < 0) {
      annotation.id = annotationType + annotation.id;
    }
    if (
      !areNonNegativeIntegers([annotation.start]) ||
      annotation.start > sequenceData.size - 1
    ) {
      response.messages.push(
        "Invalid annotation start: " +
          annotation.start +
          " detected for " +
          annotation.name +
          " and set to 1"
      ); //setting it to 0 internally, but users will see it as 1
      annotation.start = 0;
    }
    if (
      !areNonNegativeIntegers([annotation.end]) ||
      annotation.end > sequenceData.size - 1
    ) {
      response.messages.push(
        "Invalid annotation end:  " +
          annotation.end +
          " detected for " +
          annotation.name +
          " and set to 1"
      ); //setting it to 0 internally, but users will see it as 1
      annotation.end = 0;
    }
    if (annotation.start > annotation.end && sequenceData.circular === false) {
      response.messages.push(
        "Invalid circular annotation detected for " +
          annotation.name +
          ". end set to 1"
      ); //setting it to 0 internally, but users will see it as 1
      annotation.end = 0;
    }
    if (annotationType === "features") {
      annotation.color =
        featureColors[annotation.type] || featureColors.misc_feature;
    }

    if (
      annotation.forward === true ||
      annotation.forward === "true" ||
      annotation.strand === 1 ||
      annotation.strand === "1" ||
      annotation.strand === "+"
    ) {
      annotation.forward = true;
    } else {
      annotation.forward = false;
    }

    if (!annotation.type || typeof annotation.type !== "string") {
      response.messages.push(
        "Invalid annotation type detected:  " +
          annotation.type +
          " for " +
          annotation.name +
          ". set type to misc_feature"
      );
      annotation.type = "misc_feature";
    }
    return annotation;
  }
}
export default cleanSequenceData;
// export default lruMemoize(5, undefined, true)(cleanSequenceData);

import circularSelector from "./circularSelector";
import sequenceSelector from "./sequenceSelector";
import restrictionEnzymesSelector from "./restrictionEnzymesSelector";
import cutsiteLabelColorSelector from "./cutsiteLabelColorSelector";
import { createSelector } from "reselect";
import bsonObjectid from "bson-objectid";
import { flatMap as flatmap } from "lodash";
import { getCutsitesFromSequence } from "ve-sequence-utils";

// Object.keys(enzymeList).forEach(function(key){
//   var enzyme = enzymeList[key]
//   // Returns a dark RGB color with random alpha
//   enzyme.color = randomcolor({
//      luminosity: 'dark',
//      // format: 'rgba' // e.g. 'rgba(9, 1, 107, 0.6482447960879654)'
//   });
// })

function cutsitesSelector(sequence, circular, enzymeList, cutsiteLabelColors) {
  //get the cutsites grouped by enzyme
  let cutsitesByName = getCutsitesFromSequence(
    sequence,
    circular,
    Object.keys(enzymeList).map(function(enzymeName) {
      return enzymeList[enzymeName];
    })
  );
  //tag each cutsite with a unique id
  let cutsitesById = {};

  Object.keys(cutsitesByName).forEach(function(enzymeName) {
    let cutsitesForEnzyme = cutsitesByName[enzymeName];
    cutsitesForEnzyme.forEach(function(cutsite) {
      const numberOfCuts = cutsitesByName[enzymeName].length;
      const uniqueId = bsonObjectid().str;
      cutsite.id = uniqueId;
      cutsite.numberOfCuts = numberOfCuts;
      cutsite.annotationType = "cutsite";
      cutsitesById[uniqueId] = cutsite;
      if (numberOfCuts === 1) {
        cutsite.labelColor =
          cutsiteLabelColors && cutsiteLabelColors.single
            ? cutsiteLabelColors.single
            : "salmon";
        cutsite.labelClassname = "singleCutter";
      } else if (numberOfCuts === 2) {
        cutsite.labelColor =
          cutsiteLabelColors && cutsiteLabelColors.double
            ? cutsiteLabelColors.double
            : "lightblue";
        cutsite.labelClassname = "doubleCutter";
      } else {
        cutsite.labelColor =
          cutsiteLabelColors && cutsiteLabelColors.multi
            ? cutsiteLabelColors.multi
            : "lightgrey";
        cutsite.labelClassname = "multiCutter";
      }
    });
  });
  // create an array of the cutsites
  let cutsitesArray = flatmap(cutsitesByName, function(cutsitesForEnzyme) {
    return cutsitesForEnzyme;
  });
  return {
    cutsitesByName,
    cutsitesById,
    cutsitesArray
  };
}

export default createSelector(
  sequenceSelector,
  circularSelector,
  restrictionEnzymesSelector,
  cutsiteLabelColorSelector,
  function() {
    return cutsitesSelector(...arguments);
  }
);
//
//

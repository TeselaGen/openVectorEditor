import flatmap from "lodash/flatMap";
import { createSelector } from "reselect";
import cutsitesSelector from "./cutsitesSelector";
import filteredRestrictionEnzymesSelector from "./filteredRestrictionEnzymesSelector";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";

export default createSelector(
  cutsitesSelector,
  filteredRestrictionEnzymesSelector,
  function({ cutsitesByName }, filteredRestrictionEnzymes) {
    let returnVal = {
      cutsitesByName: {}
    };

    const hiddenEnzymesByName = {};
    const filteredEnzymes = [];
    filteredRestrictionEnzymes.forEach(e => {
      if (e.value.includes("__userCreatedGroup")) {
        const groupName = e.value.replace("__userCreatedGroup", "");
        const enzymes = window.getExistingEnzymeGroups()[groupName] || [];
        filteredEnzymes.concat(enzymes.map(e => ({ value: e })));
      }
      if (e.isHidden) {
        hiddenEnzymesByName[e.value] = e;
      } else {
        filteredEnzymes.push(e);
      }
    });

    if (!filteredEnzymes || filteredEnzymes.length === 0) {
      returnVal.cutsitesByName = cutsitesByName;
    } else {
      //loop through each filter option ('Single Cutters', 'BamHI')
      filteredEnzymes.forEach(function({ value }) {
        let cutsThisManyTimes =
          specialCutsiteFilterOptions[value] &&
          specialCutsiteFilterOptions[value].cutsThisManyTimes;
        if (cutsThisManyTimes > 0) {
          //the cutter type is either 1,2,3 for single, double or triple cutters
          Object.keys(cutsitesByName).forEach(function(key) {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (cutsitesByName[key].length === cutsThisManyTimes) {
              returnVal.cutsitesByName[key] = cutsitesByName[key];
            }
          });
        } else {
          //normal enzyme ('BamHI')
          if (!cutsitesByName[value]) return;
          returnVal.cutsitesByName[value] = cutsitesByName[value];
        }
      });
    }
    returnVal.cutsitesArray = flatmap(
      returnVal.cutsitesByName,
      cutsitesByNameArray => cutsitesByNameArray
    );
    returnVal.cutsitesById = returnVal.cutsitesArray.reduce(function(
      obj,
      item
    ) {
      if (item && item.id) {
        obj[item.id] = item;
      }
      return obj;
    },
    {});

    return returnVal;
  }
);

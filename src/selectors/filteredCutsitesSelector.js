import flatmap from "lodash/flatMap";
import { createSelector } from "reselect";
import cutsitesSelector from "./cutsitesSelector";
import filteredRestrictionEnzymesSelector from "./filteredRestrictionEnzymesSelector";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
import { getLowerCaseObj } from "../utils/arrayUtils";

export default createSelector(
  cutsitesSelector,
  filteredRestrictionEnzymesSelector,
  function ({ cutsitesByName }, filteredRestrictionEnzymes) {
    let returnVal = {
      cutsitesByName: {}
    };
    const cutsitesByNameLower = getLowerCaseObj(cutsitesByName);

    const hiddenEnzymesByName = {};
    let filteredEnzymes = [];
    let hasUserGroup;
    //handle adding enzymes that are included in user created groups
    filteredRestrictionEnzymes.forEach((e) => {
      if (e.value.includes("__userCreatedGroup")) {
        hasUserGroup = true;
        const enzymes = e.nameArray || [];

        filteredEnzymes = filteredEnzymes.concat(
          enzymes.map((e) => ({ value: e }))
        );
      } else if (e.isHidden) {
        hiddenEnzymesByName[e.value] = e;
      } else {
        filteredEnzymes.push(e);
      }
    });
    if (!filteredEnzymes || (filteredEnzymes.length === 0 && !hasUserGroup)) {
      returnVal.cutsitesByName = cutsitesByNameLower;
    } else {
      //loop through each filter option ('Single Cutters', 'BamHI')
      filteredEnzymes.forEach(function ({ value }) {
        const lowerValue = value.toLowerCase();
        let cutsThisManyTimes =
          specialCutsiteFilterOptions[value] &&
          specialCutsiteFilterOptions[value].cutsThisManyTimes;
        if (cutsThisManyTimes > 0) {
          //the cutter type is either 1,2,3 for single, double or triple cutters
          Object.keys(cutsitesByNameLower).forEach(function (key) {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (cutsitesByNameLower[key].length === cutsThisManyTimes) {
              returnVal.cutsitesByName[key] = cutsitesByNameLower[key];
            }
          });
        } else {
          if (hiddenEnzymesByName[value]) return; //don't show that cutsite
          //normal enzyme ('BamHI')

          if (!cutsitesByNameLower[lowerValue]) return;
          returnVal.cutsitesByName[lowerValue] =
            cutsitesByNameLower[lowerValue];
        }
      });
    }
    returnVal.cutsitesArray = flatmap(
      returnVal.cutsitesByName,
      (cutsitesByNameArray) => cutsitesByNameArray
    );
    returnVal.cutsitesById = returnVal.cutsitesArray.reduce(function (
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

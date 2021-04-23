import flatmap from "lodash/flatMap";
import { createSelector } from "reselect";
import cutsitesSelector from "./cutsitesSelector";
import filteredRestrictionEnzymesSelector from "./filteredRestrictionEnzymesSelector";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
// import { getLowerCaseObj } from "../utils/arrayUtils";
import { flatMap } from "lodash";

export default createSelector(
  cutsitesSelector,
  filteredRestrictionEnzymesSelector,
  (state, addEnzs, enzymeGroupsOverride) => enzymeGroupsOverride,
  function (
    { cutsitesByName },
    filteredRestrictionEnzymes,
    enzymeGroupsOverride
  ) {
    let returnVal = {
      cutsitesByName: {}
    };
    // const cutsitesByName = getLowerCaseObj(cutsitesByName);
    const hiddenEnzymesByName = {};
    let filteredEnzymes = [];
    let hasUserGroup;
    //handle adding enzymes that are included in user created groups
    filteredRestrictionEnzymes.forEach((e) => {
      if (e.value.includes("__userCreatedGroup")) {
        hasUserGroup = true;
        const existingGroups = {
          ...window.getExistingEnzymeGroups(),
          ...enzymeGroupsOverride
        };
        const enzymes =
          existingGroups[e.value.replace("__userCreatedGroup", "")] || [];
        const zs = flatMap(enzymes, (e) => (e ? { value: e } : []));
        filteredEnzymes = filteredEnzymes.concat(zs);
      } else if (e.isHidden) {
        hiddenEnzymesByName[e.value] = e;
      } else {
        if (!e) return;
        filteredEnzymes.push(e);
      }
    });
    if (!filteredEnzymes || (filteredEnzymes.length === 0 && !hasUserGroup)) {
      returnVal.cutsitesByName = cutsitesByName;
    } else {
      //loop through each filter option ('Single Cutters', 'BamHI')
      filteredEnzymes.forEach(function ({ value, ...rest }) {
        if (!value) {
          console.error(`Missing value for filtered enzyme`, rest);
          return;
        }
        const lowerValue = value.toLowerCase();
        let cutsThisManyTimes =
          specialCutsiteFilterOptions[value] &&
          specialCutsiteFilterOptions[value].cutsThisManyTimes;
        if (cutsThisManyTimes > 0) {
          //the cutter type is either 1,2,3 for single, double or triple cutters
          Object.keys(cutsitesByName).forEach(function (key) {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (cutsitesByName[key].length === cutsThisManyTimes) {
              returnVal.cutsitesByName[key] = cutsitesByName[key];
            }
          });
        } else {
          if (hiddenEnzymesByName[lowerValue]) return; //don't show that cutsite
          //normal enzyme ('BamHI')

          if (!cutsitesByName[lowerValue]) return;
          returnVal.cutsitesByName[lowerValue] = cutsitesByName[lowerValue];
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

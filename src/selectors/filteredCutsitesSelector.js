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
    const andReturnVal = {
      cutsitesByName: {}
    };
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
    let type2sCutsites = [];
    let cutThisManyTimesCutsites = [];
    let normaleEnzymeCutsites = [];
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
        const cutsThisManyTimes =
          specialCutsiteFilterOptions[value] &&
          specialCutsiteFilterOptions[value].cutsThisManyTimes;
        if (value === "type2s") {
          Object.keys(cutsitesByName).forEach(function (key) {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (
              cutsitesByName[key].length &&
              cutsitesByName[key][0]?.restrictionEnzyme?.isType2S
            ) {
              type2sCutsites.push(key);
              returnVal.cutsitesByName[key] = cutsitesByName[key];
            }
          });
        } else if (cutsThisManyTimes > 0) {
          //the cutter type is either 1,2,3 for single, double or triple cutters
          Object.keys(cutsitesByName).forEach(function (key) {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (cutsitesByName[key].length === cutsThisManyTimes) {
              cutThisManyTimesCutsites.push(key);
              returnVal.cutsitesByName[key] = cutsitesByName[key];
            }
          });
        } else {
          if (hiddenEnzymesByName[lowerValue]) return; //don't show that cutsite
          //normal enzyme ('BamHI')
          if (!cutsitesByName[lowerValue]) return;
          normaleEnzymeCutsites.push(lowerValue);
          returnVal.cutsitesByName[lowerValue] = cutsitesByName[lowerValue];
        }
      });
    }
    //calculate group intersect
    if (type2sCutsites.length === 0) {
      type2sCutsites = Object.keys(cutsitesByName);
    }
    if (cutThisManyTimesCutsites.length === 0) {
      cutThisManyTimesCutsites = Object.keys(cutsitesByName);
    }
    if (normaleEnzymeCutsites.length === 0) {
      normaleEnzymeCutsites = Object.keys(cutsitesByName);
    }
    // find the intersect of all groups
    const intersect1 = type2sCutsites.filter((value) =>
      cutThisManyTimesCutsites.includes(value)
    );
    const interesect2 = intersect1.filter((value) =>
      normaleEnzymeCutsites.includes(value)
    );
    window.localStorage.setItem("cutsiteIntersectionCount", interesect2.length);
    interesect2.forEach((key) => {
      andReturnVal.cutsitesByName[key] = cutsitesByName[key];
    });

    if (window.localStorage.getItem("enzymeFilterMode") === "and") {
      returnVal = andReturnVal;
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

import flatmap from "lodash/flatMap";
import { createSelector } from "reselect";
import cutsitesSelector from "./cutsitesSelector";
import filteredRestrictionEnzymesSelector from "./filteredRestrictionEnzymesSelector";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
import { flatMap } from "lodash";
import isEnzymeFilterAndSelector from "./isEnzymeFilterAndSelector";

export default createSelector(
  cutsitesSelector,
  filteredRestrictionEnzymesSelector,
  isEnzymeFilterAndSelector,
  (state, addEnzs, enzymeGroupsOverride) => enzymeGroupsOverride,
  function (
    { cutsitesByName },
    filteredRestrictionEnzymes,
    isEnzymeFilterAnd,
    enzymeGroupsOverride
  ) {
    const returnVal = {
      cutsitesByName: {}
    };
    // const cutsitesByName = getLowerCaseObj(cutsitesByName);
    const hiddenEnzymesByName = {};
    let filteredEnzymes = [];
    let enzymesFromGroups = [];
    let hasUserGroup;
    let groupCount = 0;
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
        enzymesFromGroups = enzymesFromGroups.concat(zs);
        groupCount += 1;
      } else if (e.isHidden) {
        hiddenEnzymesByName[e.value] = e;
      } else {
        if (!e) return;
        groupCount += 1;
        filteredEnzymes.push(e);
      }
    });
    const cutSiteList = [];
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
              cutSiteList.push(key);
              returnVal.cutsitesByName[key] = cutsitesByName[key];
            }
          });
        } else if (cutsThisManyTimes > 0) {
          //the cutter type is either 1,2,3 for single, double or triple cutters
          Object.keys(cutsitesByName).forEach(function (key) {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (cutsitesByName[key].length === cutsThisManyTimes) {
              cutSiteList.push(key);
              returnVal.cutsitesByName[key] = cutsitesByName[key];
            }
          });
        } else {
          if (hiddenEnzymesByName[lowerValue]) return; //don't show that cutsite
          //normal enzyme ('BamHI')
          if (!cutsitesByName[lowerValue]) return;
          cutSiteList.push(lowerValue);
          returnVal.cutsitesByName[lowerValue] = cutsitesByName[lowerValue];
        }
      });
    }

    const enzymeCounts = {};
    cutSiteList.forEach(
      (enzyme) =>
        (enzymeCounts[enzyme] = enzymeCounts[enzyme]
          ? enzymeCounts[enzyme] + 1
          : 1)
    );

    const intersectionCutSites = [];
    Object.keys(enzymeCounts).forEach((key) => {
      if (enzymeCounts[key] === groupCount) intersectionCutSites.push(key);
    });

    returnVal.cutsiteIntersectionCount = intersectionCutSites.length;

    const cutsbyname_AND = {};
    intersectionCutSites.forEach((value) => {
      cutsbyname_AND[value] = cutsitesByName[value];
    });

    returnVal.cutsiteTotalCount = Object.keys(returnVal.cutsitesByName).length;

    if (isEnzymeFilterAnd && returnVal.cutsiteIntersectionCount > 0) {
      returnVal.cutsitesByName = cutsbyname_AND;
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

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
    let hasUserGroup;
    let intersectionOfFilteredEnzymes = [];
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
        intersectionOfFilteredEnzymes = filteredEnzymes.filter((value) =>
          zs.includes(value)
        );
      } else if (e.isHidden) {
        hiddenEnzymesByName[e.value] = e;
      } else {
        if (!e) return;
        filteredEnzymes.push(e);
      }
    });
    const type2sCutsites = [];
    const cutSiteCountGroup = [];
    const individualCutsites = [];
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
              cutSiteCountGroup.push(key);
              returnVal.cutsitesByName[key] = cutsitesByName[key];
            }
          });
        } else {
          if (hiddenEnzymesByName[lowerValue]) return; //don't show that cutsite
          //normal enzyme ('BamHI')
          if (!cutsitesByName[lowerValue]) return;
          individualCutsites.push(lowerValue);
          returnVal.cutsitesByName[lowerValue] = cutsitesByName[lowerValue];
        }
      });
    }

    let intersectionOfFilteredEnzymesValues = intersectionOfFilteredEnzymes.map(
      (group) => {
        return group.value.toLowerCase();
      }
    );
    if (type2sCutsites.length > 0) {
      intersectionOfFilteredEnzymesValues =
        intersectionOfFilteredEnzymesValues.filter((value) =>
          type2sCutsites.includes(value)
        );
    }
    if (cutSiteCountGroup.length > 0) {
      intersectionOfFilteredEnzymesValues =
        intersectionOfFilteredEnzymesValues.filter((value) =>
          cutSiteCountGroup.includes(value)
        );
    }
    const uniqueIndividualCutsites = [];
    individualCutsites.forEach((c) => {
      if (!uniqueIndividualCutsites.includes(c)) {
        uniqueIndividualCutsites.push(c);
      }
    });
    if (
      uniqueIndividualCutsites.length >
      intersectionOfFilteredEnzymesValues.length
    ) {
      intersectionOfFilteredEnzymesValues = [];
    }
    returnVal.cutsiteIntersectionCount =
      intersectionOfFilteredEnzymesValues.length;

    const cutsbyname_AND = {};
    intersectionOfFilteredEnzymesValues.forEach((value) => {
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

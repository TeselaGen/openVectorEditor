import { forEach } from "lodash";
import { createSelector } from "reselect";
import {
  defaultEnzymesByName,
  aliasedEnzymesByName
} from "@teselagen/sequence-utils";

export default createSelector(
  () => defaultEnzymesByName,
  (state, additionalEnzymes) => {
    return additionalEnzymes;
  },
  () => localStorage.getItem("enzymeGroups"), //it should recompute if the enzyme groups change in localstorage
  (defaultEnzymesByName, additionalEnzymes) => {
    const enzymesFromGroups = {};
    forEach(window.getExistingEnzymeGroups(), (group) => {
      forEach(group, (enzymeName) => {
        const enzyme = { ...aliasedEnzymesByName, ...additionalEnzymes }[
          enzymeName.toLowerCase()
        ];
        if (!enzyme) {
          console.warn("ruh roh, no enzyme found for: ", enzymeName);
        } else {
          enzymesFromGroups[enzymeName.toLowerCase()] = enzyme;
        }
      });
    });
    return {
      ...defaultEnzymesByName,
      ...additionalEnzymes,
      ...enzymesFromGroups
    };
  }
);

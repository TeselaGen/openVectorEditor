import { createSelector } from "reselect";
import defaultEnzymeList from "../redux/utils/defaultEnzymeList.js";
import { reduce } from "lodash";

export default createSelector(
  () => defaultEnzymeList,
  () => localStorage.getItem("enzymeGroups"), //it should recompute if the enzyme groups change in localstorage
  () => {
    const userEnzymeGroups = window.getExistingEnzymeGroupsWithEnzymeData();
    return {
      ...defaultEnzymeList,
      ...reduce(
        userEnzymeGroups,
        (acc, group) => {
          // tnrtodo: more work needed here to return user created enzymes + default enzymes
          // const group = userEnzymeGroups[key];
          (group || []).forEach(enzyme => {
            acc[enzyme.name.toLowerCase()] = enzyme;
          });
          return acc;
        },
        {}
      )
    };
  }
);

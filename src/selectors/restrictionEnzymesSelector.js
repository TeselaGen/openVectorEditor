import defaultEnzymeList from "../redux/utils/defaultEnzymeList.json";
// import expandedEnzymeList from "../redux/utils/expandedEnzymeList.json";
import { reduce } from "lodash";
export default () => {
  const userEnzymeGroups = window.getExistingEnzymeGroups();

  return {
    ...defaultEnzymeList,
    ...reduce(
      userEnzymeGroups,
      (acc /* key */) => {
        // tnrtodo: more work needed here to return user created enzymes + default enzymes
        // const group = userEnzymeGroups[key];
        // acc[key] = "";
        return acc;
      },
      {}
    )
  };
};

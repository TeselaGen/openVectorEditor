import { createSelector } from "reselect";
import { getCustomEnzymes } from "../utils/editorUtils";

export default createSelector(
  () => window.localStorage.getItem("customEnzymes"),
  (state, additionalEnzymes) => {
    return additionalEnzymes;
  },
  (customEnzymesString, additionalEnzymes) => {
    return {
      ...additionalEnzymes,
      ...getCustomEnzymes(customEnzymesString)
    };
  }
);

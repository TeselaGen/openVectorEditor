import { createSelector } from "reselect";
import sequenceDataSelector from "./sequenceDataSelector";

export default createSelector(sequenceDataSelector, function(sequenceData) {
  return sequenceData.cutsiteLabelColors;
});

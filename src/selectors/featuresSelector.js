import { createSelector } from "reselect";
import sequenceDataSelector from "./sequenceDataSelector";

function featuresRawSelector(sequenceData) {
  return sequenceData.features;
}

export default createSelector(sequenceDataSelector, featuresRawSelector);

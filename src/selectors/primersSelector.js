import { createSelector } from "reselect";
import sequenceDataSelector from "./sequenceDataSelector";

function primersRawSelector(sequenceData) {
  return sequenceData.primers;
}

export default createSelector(sequenceDataSelector, primersRawSelector);

import { createSelector } from "reselect";
import sequenceDataSelector from "./sequenceDataSelector";

function partsRawSelector(sequenceData) {
  return sequenceData.parts;
}

export default createSelector(sequenceDataSelector, partsRawSelector);

import { createSelector } from "reselect";
import sequenceDataSelector from "./sequenceDataSelector";

function translationsRawSelector(sequenceData) {
  return sequenceData.translations;
}

export default createSelector(sequenceDataSelector, translationsRawSelector);

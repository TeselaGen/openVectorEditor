import { createSelector } from "reselect";
import { omitBy } from "lodash";
import primersSelector from "./primersSelector";
import sequenceLengthSelector from "./sequenceLengthSelector";
import { hideAnnByLengthFilter } from "../utils/editorUtils";

function filteredPrimersSelector(
  primers,
  seqLen,
  primerIndividualToHide,
  lengthsToHide
) {
  return omitBy(primers, (ann) => {
    const hideIndividually = primerIndividualToHide[ann.id];
    return (
      hideAnnByLengthFilter(lengthsToHide, ann, seqLen) || hideIndividually
    );
  });
}

export default createSelector(
  primersSelector,
  sequenceLengthSelector,
  (state) => state.annotationVisibility.primerIndividualToHide,
  (state) => state.primerLengthsToHide,
  filteredPrimersSelector
);

import { createSelector } from "reselect";
import partsSelector from "./partsSelector";
import tagsToBoldSelector from "./tagsToBoldSelector";
import { some, keyBy, omitBy } from "lodash";
import { map } from "lodash";
import sequenceLengthSelector from "./sequenceLengthSelector";
import { hideAnnByLengthFilter } from "../utils/editorUtils";
import { addWrappedAddons } from "../utils/addWrappedAddons";

function filteredPartsSelector(
  parts,
  seqLen,
  partIndividualToHide,
  tagsToBold,
  lengthsToHide
) {
  if (tagsToBold) {
    const keyedTagsToBold = keyBy(tagsToBold, "value");

    return map(parts || {}, (p) => {
      if (p.tags) {
        if (
          some(p.tags, (tagId) => {
            return keyedTagsToBold[tagId];
          })
        ) {
          return {
            ...p,
            className: "partWithSelectedTag",
            labelClassName: "partWithSelectedTag",
            highPriorityLabel: true
          };
        } else {
          return p;
        }
      }
    });
  }

  const toRet = map(
    omitBy(parts, (ann) => {
      const hideIndividually = partIndividualToHide[ann.id];
      return (
        hideAnnByLengthFilter(lengthsToHide, ann, seqLen) || hideIndividually
      );
    })
  );
  return addWrappedAddons(toRet, seqLen);
}
export default createSelector(
  partsSelector,
  sequenceLengthSelector,
  (state) => state.annotationVisibility.partIndividualToHide,
  tagsToBoldSelector,
  (state) => state.partLengthsToHide,
  filteredPartsSelector
);

import { createSelector } from "reselect";
import partsSelector from "./partsSelector";
import tagsToBoldSelector from "./tagsToBoldSelector";
import { some, keyBy, omitBy } from "lodash";
import { map } from "lodash";
import sequenceLengthSelector from "./sequenceLengthSelector";
import { hideAnnByLengthFilter } from "../utils/editorUtils";

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

  const wrappedPartAddons = [];
  const toRet = map(
    omitBy(parts, (ann) => {
      const hideIndividually = partIndividualToHide[ann.id];
      const toRetInner =
        hideAnnByLengthFilter(lengthsToHide, ann, seqLen) || hideIndividually;

      if (!toRetInner && ann.overlapsSelf) {
        wrappedPartAddons.push({
          ...ann,
          start: ann.end + 1,
          end: ann.start - 1,
          isWrappedAddon: true,
          rangeTypeOverride: "middle" //we add this rangeTypeOverride here to get the wrapping piece to draw differently than normal
        });
      }
      return toRetInner;
    })
  );
  return [...toRet, ...wrappedPartAddons];
}
export default createSelector(
  partsSelector,
  sequenceLengthSelector,
  (state) => state.annotationVisibility.partIndividualToHide,
  tagsToBoldSelector,
  (state) => state.partLengthsToHide,
  filteredPartsSelector
);

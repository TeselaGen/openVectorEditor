import { createSelector } from "reselect";
import partsSelector from "./partsSelector";
import tagsToBoldSelector from "./tagsToBoldSelector";
import { some, keyBy } from "lodash";
import { map } from "lodash";
function filteredPartsSelector(parts, tagsToBold) {
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
  return parts;
}
export default createSelector(
  partsSelector,
  tagsToBoldSelector,
  filteredPartsSelector
);

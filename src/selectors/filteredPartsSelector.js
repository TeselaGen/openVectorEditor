import { createSelector } from "reselect";
import partsSelector from "./partsSelector";
import tagsToBoldSelector from "./tagsToBoldSelector";
import { some, keyBy } from "lodash";
function filteredPartsSelector(parts, tagsToBold) {
  if (tagsToBold) {
    const keyedTagsToBold = keyBy(tagsToBold, "value");

    Object.keys(parts || {}).forEach((key) => {
      const p = parts[key];
      if (p.tags) {
        //["1:2", "5"]

        if (
          some(p.tags, (tagId) => {
            return keyedTagsToBold[tagId];
          })
        ) {
          p.labelClassName = "partWithSelectedTag";
          p.highPriorityLabel = true;
        } else {
          delete p.labelClassName;
          delete p.highPriorityLabel;
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

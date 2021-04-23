import { createSelector } from "reselect";
import { filter } from "lodash";
export const searchableTypes = ["parts", "features", "primers"];

function annotationSearchSelector(isOpen, searchString, ...rest) {
  if (!searchString || !isOpen) {
    return [];
  }
  return searchableTypes.map((type, i) => {
    const annotations = rest[i];
    return filter(annotations, (ann) =>
      ann.name
        .toLowerCase()
        .includes(searchString ? searchString.toLowerCase() : "")
    );
  });
}

export default createSelector(
  (state) => state.findTool && state.findTool.isOpen,
  (state) => state.findTool && state.findTool.searchText,
  ...searchableTypes.map((type) => (state) => state.sequenceData[type]),
  annotationSearchSelector
);

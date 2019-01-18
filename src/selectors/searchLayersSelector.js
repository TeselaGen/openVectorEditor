import { findSequenceMatches } from "ve-sequence-utils";
import sequenceSelector from "./sequenceSelector";
import { createSelector } from "reselect";
import circularSelector from "./circularSelector";

function searchLayersSelector(
  sequence,
  isCircular,
  searchString,
  ambiguousOrLiteral,
  dnaOrAA
) {
  if (!searchString) {
    return [];
  }
  const matches = findSequenceMatches(sequence, searchString, {
    isCircular,
    isAmbiguous: ambiguousOrLiteral === "AMBIGUOUS",
    isProteinSearch: dnaOrAA !== "DNA",
    searchReverseStrand: true
  }).sort(({ start }, { start: start2 }) => {
    return start - start2;
  });
  return matches;
  // return matches.map(m => ({ ...m, hideCarets: true, color: "yellow" }));
}

export default createSelector(
  sequenceSelector,
  circularSelector,
  state => state.findTool && state.findTool.searchText,
  state => state.findTool && state.findTool.ambiguousOrLiteral,
  state => state.findTool && state.findTool.dnaOrAA,
  searchLayersSelector
);

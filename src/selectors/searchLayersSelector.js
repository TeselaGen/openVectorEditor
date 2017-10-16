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
  return findSequenceMatches(sequence, searchString, {
    isCircular,
    ambiguous: ambiguousOrLiteral !== "AMBIGUOUS",
    isProteinSearch: dnaOrAA !== "DNA"
  });
}

export default createSelector(
  sequenceSelector,
  circularSelector,
  state => state.findTool.searchText,
  state => state.findTool.ambiguousOrLiteral,
  state => state.findTool.dnaOrAA,
  searchLayersSelector
);

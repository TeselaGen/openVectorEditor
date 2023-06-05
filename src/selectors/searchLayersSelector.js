import { findSequenceMatches } from "@teselagen/sequence-utils";
import sequenceSelector from "./sequenceSelector";
import { createSelector } from "reselect";
import circularSelector from "./circularSelector";

function searchLayersSelector(
  sequence,
  isCircular,
  isOpen,
  searchString,
  ambiguousOrLiteral,
  dnaOrAA,
  isProtein,
  proteinSequence
) {
  if (!searchString || !isOpen) {
    return [];
  }
  if (isProtein) {
    const searchingDna = dnaOrAA === "DNA";
    const matches = findSequenceMatches(
      searchingDna ? sequence : proteinSequence,
      searchString,
      {
        isCircular: false,
        isProteinSequence: true,
        isAmbiguous: ambiguousOrLiteral === "AMBIGUOUS",
        // isProteinSearch: dnaOrAA !== "DNA",
        searchReverseStrand: false
      }
    ).sort(({ start }, { start: start2 }) => {
      return start - start2;
    });
    return searchingDna
      ? matches
      : matches.map(({ start, end, ...rest }) => ({
          ...rest,
          isSearchLayer: true,
          start: start * 3,
          end: end * 3 + 2
        }));
  }
  const matches = findSequenceMatches(sequence, searchString, {
    isCircular,
    isAmbiguous: ambiguousOrLiteral === "AMBIGUOUS",
    isProteinSearch: dnaOrAA !== "DNA",
    searchReverseStrand: true
  }).sort(({ start }, { start: start2 }) => {
    return start - start2;
  });
  return matches.map((match) => ({
    ...match,
    forward: !match.bottomStrand,
    className:
      "veSearchLayer " +
      (match.bottomStrand ? " veSearchLayerBottomStrand" : ""),
    isSearchLayer: true
  }));
}

export default createSelector(
  sequenceSelector,
  circularSelector,
  (state) => state.findTool && state.findTool.isOpen,
  (state) => state.findTool && state.findTool.searchText,
  (state) => state.findTool && state.findTool.ambiguousOrLiteral,
  (state) => state.findTool && state.findTool.dnaOrAA,
  (state) => state.sequenceData.isProtein,
  (state) => state.sequenceData.proteinSequence,
  searchLayersSelector
);

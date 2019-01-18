import { createSelector } from "reselect";
import searchLayersSelector from "./searchLayersSelector";

export default createSelector(
  searchLayersSelector,
  state => state.findTool && state.findTool.dnaOrAA,
  state => state.findTool && state.findTool.highlightAll,
  state => state.findTool && state.findTool.matchNumber,
  (searchLayers, dnaOrAA, highlightAll, matchNumber) => {
    if (dnaOrAA === "DNA") return [];
    if (!highlightAll) return [searchLayers[matchNumber]];
    return searchLayers;
  }
);

import circularSelector from "./circularSelector";
import sequenceSelector from "./sequenceSelector";
import minimumOrfSizeSelector from "./minimumOrfSizeSelector";
import { findOrfsInPlasmid } from "@teselagen/sequence-utils";
import { createSelector } from "reselect";

export default createSelector(
  sequenceSelector,
  circularSelector,
  minimumOrfSizeSelector,
  (state) => state.useAdditionalOrfStartCodons,
  findOrfsInPlasmid
);

//tiny

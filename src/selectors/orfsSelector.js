import circularSelector from "./circularSelector";
import sequenceSelector from "./sequenceSelector";
import minimumOrfSizeSelector from "./minimumOrfSizeSelector";
import { findOrfsInPlasmid } from "ve-sequence-utils";
// import bsonObjectid from 'bson-objectid';
import { createSelector } from "reselect";

export default createSelector(
  sequenceSelector,
  circularSelector,
  minimumOrfSizeSelector,
  state => state.useAdditionalOrfStartCodons,
  findOrfsInPlasmid
);

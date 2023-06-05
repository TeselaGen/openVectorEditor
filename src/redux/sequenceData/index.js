import deepEqual from "deep-equal";
import { tidyUpSequenceData } from "@teselagen/sequence-utils";
import uuid from "shortid";

import createAction from "../utils/createMetaAction";
import features from "./features";
import parts from "./parts";
import name from "./name";
import description from "./description";
import primers from "./primers";
import sequence from "./sequence";
import circular from "./circular";
import materiallyAvailable from "./materiallyAvailable";
import translations from "./translations";
import combineReducersDontIgnoreKeys from "../../utils/combineReducersDontIgnoreKeys";
// import cleanSequenceData from "../../utils/cleanSequenceData";

import { createReducer } from "redux-act";
// export * from './sharedActionCreators';
export * from "./primers";
export * from "./features";
export * from "./parts";
export * from "./name";
export * from "./description";
// export * from './sequence';
export * from "./circular";
export * from "./materiallyAvailable";
export * from "./translations";

// ------------------------------------
// Actions
// ------------------------------------

const _updateSequenceData = createAction("SEQUENCE_DATA_UPDATE");
export const updateSequenceData = function (seqData, ...rest) {
  //tnrtodo: currently we're not using that type variable for anything
  return _updateSequenceData(
    tidyUpSequenceData(seqData, { annotationsAsObjects: true }),
    ...rest
  );
};

// ------------------------------------
// Reducer
// ------------------------------------

const coreReducer = combineReducersDontIgnoreKeys({
  primers,
  features,
  parts,
  sequence,
  translations,
  size: (state = {}) => state,
  circular,
  materiallyAvailable,
  name,
  description,
  fromFileUpload: createReducer({}, false)
});

export default function (state, action) {
  let stateToPass = state;
  if (action.type === "SEQUENCE_DATA_UPDATE") {
    stateToPass = action.payload;
  }
  //tnr: do a clone deep here in order to make sure we are using a totally new object for undo/redo tracking
  // stateToPass = cloneDeep(stateToPass);

  const newState = coreReducer(stateToPass, action);
  if (deepEqual(newState, state)) {
    return state;
  } else {
    //tnr: do a clone deep here in order to make sure we are using a totally new object for undo/redo tracking
    // mm: we don't need this if we are not mutating the newState, which we shouldn't be doing.
    return {
      // ...cloneDeep(newState),
      ...newState,
      stateTrackingId: newState.stateTrackingId ? uuid() : "initialLoadId"
    };
  }
}

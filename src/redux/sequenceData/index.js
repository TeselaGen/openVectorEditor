import { cloneDeep } from "lodash";
import deepEqual from "deep-equal";
import { tidyUpSequenceData } from "ve-sequence-utils";

import createAction from "../utils/createMetaAction";
import features from "./features";
import parts from "./parts";
import name from "./name";
import primers from "./primers";
import sequence from "./sequence";
import translations from "./translations";
import combineReducersDontIgnoreKeys from "../../utils/combineReducersDontIgnoreKeys";
// import cleanSequenceData from "../../utils/cleanSequenceData";

import { createReducer } from "redux-act";
// export * from './sharedActionCreators';
export * from "./primers";
export * from "./features";
export * from "./parts";
export * from "./name";
// export * from './sequence';
// export * from './circular';
export * from "./translations";

// ------------------------------------
// Actions
// ------------------------------------

const _updateSequenceData = createAction("SEQUENCE_DATA_UPDATE");
export const updateSequenceData = function(seqData, ...rest) {
  return _updateSequenceData(
    tidyUpSequenceData(seqData, { annotationsAsObjects: true }),
    ...rest
  );
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function(state, action) {
  let stateToPass = state;
  if (action.type === "SEQUENCE_DATA_UPDATE") {
    stateToPass = action.payload;
  }
  //tnr: do a clone deep here in order to make sure we are using a totally new object for undo/redo tracking
  // stateToPass = cloneDeep(stateToPass);

  const newState = combineReducersDontIgnoreKeys({
    primers,
    features,
    parts,
    sequence,
    translations,
    size: (state = {}) => state,
    circular: createReducer({}, true),
    name,
    fromFileUpload: createReducer({}, false)
  })(stateToPass, action);
  if (deepEqual(newState, state)) {
    return state;
  } else {
    //tnr: do a clone deep here in order to make sure we are using a totally new object for undo/redo tracking
    return cloneDeep(newState);
  }
}

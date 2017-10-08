import createAction from "../utils/createMetaAction";
import features from "./features";
import primers from "./primers";
import sequence from "./sequence";
import translations from "./translations";
import combineReducersDontIgnoreKeys from "../../utils/combineReducersDontIgnoreKeys";
import cleanSequenceData from "../../utils/cleanSequenceData";
import { createReducer } from "redux-act";
// export * from './sharedActionCreators';
export * from "./primers";
// export * from './features';
// export * from './sequence';
// export * from './circular';
export * from "./translations";

// ------------------------------------
// Actions
// ------------------------------------

const _updateSequenceData = createAction("SEQUENCE_DATA_UPDATE");
export const updateSequenceData = function(seqData, ...rest) {
  return _updateSequenceData(cleanSequenceData(seqData), ...rest);
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function(state, action) {
  let stateToPass = state;
  if (action.type === "SEQUENCE_DATA_UPDATE") {
    stateToPass = action.payload;
  }

  return combineReducersDontIgnoreKeys({
    primers,
    features,
    sequence,
    parts: (state = {}) => state,
    size: (state = {}) => state,
    circular: createReducer({}, true),
    translations,
    name: createReducer({}, ""),
    fromFileUpload: createReducer({}, false)
  })(stateToPass, action);
}

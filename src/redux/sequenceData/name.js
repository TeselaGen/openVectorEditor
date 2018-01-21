import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const sequenceNameUpdate = createAction("sequenceNameUpdate");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [sequenceNameUpdate]: (state, payload) => {
      return payload;
    }
  },
  "Untitled Sequence"
);

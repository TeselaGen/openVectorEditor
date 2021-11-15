import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const updateSequenceSpacing = createAction("updateSequenceSpacing");

const newVal = window.localStorage.getItem("charWidth");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [updateSequenceSpacing]: (state, payload) => {
      localStorage.setItem("charWidth", payload);
      return payload;
    }
  },
  newVal || 9
);

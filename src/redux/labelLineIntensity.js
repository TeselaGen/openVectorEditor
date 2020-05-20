import { createReducer } from "redux-act";

import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const changeLabelLineIntensity = createAction(
  "changeLabelLineIntensity"
);

const newVal = window.localStorage.getItem("labelLineIntensity");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [changeLabelLineIntensity]: (state, payload) => {
      localStorage.setItem("labelLineIntensity", payload);
      return payload;
    }
  },
  newVal ? parseFloat(newVal) : 0.1 //  0.1 (low) || 0.4 (med) || 0.7 (high) || 1.0 (full)
);

import { createReducer } from "redux-act";

import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleExternalLabels = createAction("toggleExternalLabels");

const newVal = window.localStorage.getItem("externalLabels");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [toggleExternalLabels]: (state, payload) => {
      localStorage.setItem("externalLabels", payload);
      return payload;
    }
  },
  newVal || "noPreference" //  noPreference || true || false
);

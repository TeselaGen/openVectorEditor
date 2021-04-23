import { createReducer } from "redux-act";

import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const changeLabelSize = createAction("changeLabelSize");

const newVal = window.localStorage.getItem("labelSize");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [changeLabelSize]: (state, payload) => {
      localStorage.setItem("labelSize", payload);
      return payload;
    }
  },
  newVal ? parseInt(newVal) : 8 //  8 is 100% label size
);

import { createReducer } from "redux-act";

//./caretPosition.js
import createAction from "./utils/createMetaAction";
// import createReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleShowMeltingTemp = createAction("toggleShowMeltingTemp");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [toggleShowMeltingTemp]: (state, val) => {
      localStorage.setItem("showMeltingTemp", val);
      return val;
    }
  },
  window.localStorage.getItem("showMeltingTemp")
);

import { createReducer } from "redux-act";

//./caretPosition.js
import createAction from "./utils/createMetaAction";
// import createReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const updateSequenceCase = createAction("updateSequenceCase");

const newVal = window.localStorage.getItem("uppercaseSequenceMapFont");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [updateSequenceCase]: (state, payload) => {
      localStorage.setItem("uppercaseSequenceMapFont", payload);
      return payload;
    }
  },
  newVal || "noPreference" //  noPreference || uppercase || lowercase
);

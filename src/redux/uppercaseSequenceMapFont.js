import { createReducer } from "redux-act";

//./caretPosition.js
import createAction from "./utils/createMetaAction";
// import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const updateSequenceCase = createAction("updateSequenceCase");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [updateSequenceCase]: (state, payload) => {
      return payload;
    }
  },
  "noPreference" //  noPreference || uppercase || lowercase
);

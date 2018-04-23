//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleReadOnlyMode = createAction(
  "TOGGLE_READ_ONLY_MODE",
  () => {}
); //NOTE!!:: second argument sanitizes actions so no payload is passed
export const updateReadOnlyMode = createAction("UPDATE_READ_ONLY_MODE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [updateReadOnlyMode]: (state, payload) => {
      return payload;
    },
    [toggleReadOnlyMode]: state => {
      return !state;
    }
  },
  true
);

//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleReadOnlyMode = createAction("TOGGLE_READ_ONLY_MODE", () => {}); //NOTE!!:: second argument sanitizes actions so no payload is passed

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [toggleReadOnlyMode]: (state) => {
      return !state;
    },
  },
  true
);

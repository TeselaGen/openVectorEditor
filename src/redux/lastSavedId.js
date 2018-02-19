//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const lastSavedIdUpdate = createAction("lastSavedIdUpdate"); //NOTE!!:: second argument sanitizes actions so no payload is passed

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [lastSavedIdUpdate]: (state, payload) => {
      return payload;
    }
  },
  null
);

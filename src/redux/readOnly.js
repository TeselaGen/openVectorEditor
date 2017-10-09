//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const turnReadOnlyModeOn = createAction("TURN_READ_ONLY_MODE_ON");
export const turnReadOnlyModeOff = createAction("TURN_READ_ONLY_MODE_OFF");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [turnReadOnlyModeOn]: () => {
      return true;
    },
    [turnReadOnlyModeOff]: () => {
      return false;
    }
  },
  true
);

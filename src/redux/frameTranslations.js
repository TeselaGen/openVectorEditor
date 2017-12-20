//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const frameTranslationToggle = createAction("FRAME_TRANSLATION_TOGGLE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [frameTranslationToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    }
  },
  {
    "1": false,
    "2": false,
    "3": false,
    "-1": false,
    "-2": false,
    "-3": false
  }
);

export function getMinimumOrfSize(state) {
  return state;
}

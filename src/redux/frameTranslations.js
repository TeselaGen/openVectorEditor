//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const frameTranslationToggle = createAction("FRAME_TRANSLATION_TOGGLE");
export const frameTranslationToggleOn = createAction(
  "FRAME_TRANSLATION_TOGGLE_ON"
);
export const frameTranslationToggleOff = createAction(
  "FRAME_TRANSLATION_TOGGLE_OFF"
);

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
    },
    [frameTranslationToggleOn]: (state, payload) => {
      return {
        ...state,
        [payload]: true
      };
    },
    [frameTranslationToggleOff]: (state, payload) => {
      return {
        ...state,
        [payload]: false
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

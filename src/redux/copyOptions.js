//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleCopyOption = createAction("TOGGLE_COPY_OPTION"); //NOTE!!:: second argument sanitizes actions so no payload is passed

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [toggleCopyOption]: (state, type) => {
      return {
        ...state,
        [type]: !state[type]
      };
    }
  },
  {
    features: true,
    partialFeatures: true,
    parts: true,
    partialParts: true
  }
);

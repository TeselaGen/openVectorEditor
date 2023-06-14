//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const toggleCopyOption = createAction("TOGGLE_COPY_OPTION"); //NOTE!!:: second argument sanitizes actions so no payload is passed

export const defaultCopyOptions = {
  features: true,
  partialFeatures: false,
  parts: true,
  partialParts: false
};

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [toggleCopyOption]: (state, type) => {
      return {
        ...state,
        ...(type === "partialFeatures" && !state[type] && { features: true }),
        ...(type === "partialParts" && !state[type] && { parts: true }),
        ...(type === "features" && { partialFeatures: !state[type] }),
        ...(type === "parts" && { partialParts: !state[type] }),
        [type]: !state[type]
      };
    }
  },
  defaultCopyOptions
);

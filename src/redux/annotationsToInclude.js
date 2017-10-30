//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

const includeInitialValues = {
  parts: true,
  features: true,
  translations: true,
  primers: true,
  cutsites: true,
  orfs: true
};

// ------------------------------------
// Actions
// ------------------------------------
export const annotationIncludeToggle = createAction("annotationIncludeToggle");
//eg: annotationIncludeToggle('features')
export const annotationInclude = createAction("annotationInclude");
export const annotationExclude = createAction("annotationExclude");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [annotationIncludeToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    },
    [annotationInclude]: (state, payload) => {
      return {
        ...state,
        [payload]: false
      };
    },
    [annotationExclude]: (state, payload) => {
      return {
        ...state,
        [payload]: true
      };
    }
  },
  includeInitialValues
);

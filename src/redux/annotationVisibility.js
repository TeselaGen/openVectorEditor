//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

const visibilityInitialValues = {
  features: true,
  translations: true,
  parts: true,
  orfs: true,
  orfTranslations: true,
  axis: true,
  cutsites: true,
  primers: true,
  reverseSequence: true,
  lineageLines: true,
  axisNumbers: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const annotationVisibilityToggle = createAction(
  "annotationVisibilityToggle"
);
//eg: annotationVisibilityToggle('features')
export const annotationVisibilityHide = createAction(
  "annotationVisibilityHide"
);
export const annotationVisibilityShow = createAction(
  "annotationVisibilityShow"
);

// ------------------------------------
// Reducer
// ------------------------------------
let annotationVisibility = createReducer(
  {
    [annotationVisibilityToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    },
    [annotationVisibilityHide]: (state, payload) => {
      return {
        ...state,
        [payload]: false
      };
    },
    [annotationVisibilityShow]: (state, payload) => {
      return {
        ...state,
        [payload]: true
      };
    }
  },
  visibilityInitialValues
);

export default annotationVisibility;

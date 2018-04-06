//./caretPosition.js

import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

const visibilityInitialValues = {
  features: true,
  translations: true,
  parts: true,
  orfs: false,
  orfTranslations: false,
  cdsFeatureTranslations: true,
  axis: true,
  cutsites: true,
  primers: true,
  reverseSequence: true,
  lineageLines: true,
  axisNumbers: true
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
let annotationVisibility = createMergedDefaultStateReducer(
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

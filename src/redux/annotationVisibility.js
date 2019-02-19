//./caretPosition.js

import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

export const visibilityDefaultValues = {
  features: true,
  translations: true,
  parts: true,
  orfs: false,
  orfTranslations: false,
  cdsFeatureTranslations: true,
  axis: true,
  cutsites: true,
  cutsitesInSequence: true,
  primers: true,
  dnaColors: false,
  sequence: true,
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
  visibilityDefaultValues
);

export default annotationVisibility;

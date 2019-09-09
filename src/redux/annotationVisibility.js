import { omit } from "lodash";

//./caretPosition.js

import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

export const visibilityDefaultValues = {
  featureTypesToHide: {},
  features: true,
  warnings: true,
  assemblyPieces: true,
  lineageAnnotations: true,
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
export const hideFeatureTypes = createAction("hideFeatureTypes");
export const showFeatureTypes = createAction("showFeatureTypes");
export const resetFeatureTypesToHide = createAction("resetFeatureTypesToHide");

// ------------------------------------
// Reducer
// ------------------------------------
let annotationVisibility = createMergedDefaultStateReducer(
  {
    [resetFeatureTypesToHide]: state => {
      return {
        ...state,
        featureTypesToHide: {}
      };
    },
    [showFeatureTypes]: (state, payload) => {
      return {
        ...state,
        featureTypesToHide: omit(state.featureTypesToHide, payload)
      };
    },
    [hideFeatureTypes]: (state, payload) => {
      return {
        ...state,
        featureTypesToHide: {
          ...state.featureTypesToHide,
          ...payload.reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {})
        }
      };
    },
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

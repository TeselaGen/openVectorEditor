import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

const alignmentVisibilityInitialValues = {
  features: false,
  translations: false,
  parts: false,
  orfs: false,
  orfTranslations: false,
  axis: true,
  cutsites: false,
  primers: false,
  reverseSequence: false,
  lineageLines: false,
  axisNumbers: true
};

// ------------------------------------
// Actions
// ------------------------------------
export const alignmentAnnotationVisibilityToggle = createAction(
  "alignmentAnnotationVisibilityToggle"
);
export const alignmentAnnotationVisibilityHide = createAction(
  "alignmentAnnotationVisibilityHide"
);
export const alignmentAnnotationVisibilityShow = createAction(
  "alignmentAnnotationVisibilityShow"
);

// ------------------------------------
// Reducer
// ------------------------------------
let alignmentAnnotationVisibility = createMergedDefaultStateReducer(
  {
    [alignmentAnnotationVisibilityToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    },
    [alignmentAnnotationVisibilityHide]: (state, payload) => {
      return {
        ...state,
        [payload]: false
      };
    },
    [alignmentAnnotationVisibilityShow]: (state, payload) => {
      return {
        ...state,
        [payload]: true
      };
    }
  },
  alignmentVisibilityInitialValues
);

export default alignmentAnnotationVisibility;
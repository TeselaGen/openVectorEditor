//./caretPosition.js
import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

const visibilityInitialValues = {
  features: true,
  parts: true,
  primers: true,
  cutsites: true,
  assemblyPieces: true,
  lineageAnnotations: true,
  warnings: true
};

// ------------------------------------
// Actions
// ------------------------------------
export const annotationLabelVisibilityToggle = createAction(
  "annotationLabelVisibilityToggle"
);
export const annotationLabelVisibilityShow = createAction(
  "annotationLabelVisibilityShow"
);
export const annotationLabelVisibilityHide = createAction(
  "annotationLabelVisibilityHide"
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [annotationLabelVisibilityToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    },
    [annotationLabelVisibilityShow]: (state, payload) => {
      return {
        ...state,
        [payload]: true
      };
    },
    [annotationLabelVisibilityHide]: (state, payload) => {
      return {
        ...state,
        [payload]: false
      };
    }
  },
  visibilityInitialValues
);

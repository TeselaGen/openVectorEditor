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
    }
  },
  visibilityInitialValues
);

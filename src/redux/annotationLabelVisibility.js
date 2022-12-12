//./caretPosition.js
import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
import { getPersistedVisibility } from "./getPersistedVisibility";

const labelVisibilityDefaultValues = {
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
export const refreshAnnotationLabelVis = createAction(
  "refreshAnnotationLabelVis"
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
    [refreshAnnotationLabelVis]: () => {
      return "__RESET__";
    },
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
  ...getPersistedVisibility({
    defaultVals: labelVisibilityDefaultValues,
    persistKey: "oveLabelVizDefaults_"
  })
);

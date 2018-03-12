import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

const alignmentVisibilityInitialValues = {
  features: false,
  parts: false,
  cutsites: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const alignmentAnnotationLabelVisibilityToggle = createAction(
  "alignmentAnnotationLabelVisibilityToggle"
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [alignmentAnnotationLabelVisibilityToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    }
  },
  alignmentVisibilityInitialValues
);

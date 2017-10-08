//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";
const visibilityInitialValues = {
  features: true,
  parts: true,
  cutsites: true
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
export default createReducer(
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

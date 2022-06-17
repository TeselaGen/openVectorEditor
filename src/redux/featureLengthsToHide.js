import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const updateFeatureLengthsToHide = createAction(
  "updateFeatureLengthsToHide"
);
export const toggleFeatureLengthsToHide = createAction(
  "toggleFeatureLengthsToHide"
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [updateFeatureLengthsToHide]: (state, payload) => {
      return { ...state, ...payload };
    },
    [toggleFeatureLengthsToHide]: (state) => {
      return { ...state, enabled: !state["enabled"] };
    }
  },
  { enabled: false, min: 0, max: 800 }
);

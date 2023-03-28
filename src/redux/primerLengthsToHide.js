import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const updatePrimerLengthsToHide = createAction(
  "updatePrimerLengthsToHide"
);
export const togglePrimerLengthsToHide = createAction(
  "togglePrimerLengthsToHide"
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [updatePrimerLengthsToHide]: (state, payload) => {
      return { ...state, ...payload };
    },
    [togglePrimerLengthsToHide]: (state) => {
      return { ...state, enabled: !state["enabled"] };
    }
  },
  { enabled: false, min: 0, max: 40 }
);

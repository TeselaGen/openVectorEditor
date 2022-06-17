import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const updatePartLengthsToHide = createAction("updatePartLengthsToHide");
export const togglePartLengthsToHide = createAction("togglePartLengthsToHide");

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [updatePartLengthsToHide]: (state, payload) => {
      return { ...state, ...payload };
    },
    [togglePartLengthsToHide]: (state) => {
      return { ...state, enabled: !state["enabled"] };
    }
  },
  { enabled: false, min: 0, max: 800 }
);

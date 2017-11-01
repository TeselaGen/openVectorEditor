import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const panelsShownUpdate = createAction("PANELS_SHOWN_UPDATE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [panelsShownUpdate]: (state, payload) => {
      return payload;
    }
  },
  {
    sequence: true,
    circular: true,
    rail: false
  }
);

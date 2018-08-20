import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const updateGuides = createAction("updateSearchText");
// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [updateGuides]: (state, payload) => {
      return {
        ...state,
        guides: payload
      };
    },
  },
  {
    guides: [{id: "guide1", start: 0, end: 50}],
  }
);

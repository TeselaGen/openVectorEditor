import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const updateSelectedFragment = createAction("updateSelectedFragment");

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [updateSelectedFragment]: (state, payload) => {
      return {
        ...state,
        selectedFragment: payload
      };
    }
  },
  {
    selectedFragment: undefined
  }
);

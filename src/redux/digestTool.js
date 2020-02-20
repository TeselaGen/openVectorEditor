import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const updateSelectedFragment = createAction("updateSelectedFragment");
export const updateComputePartialDigest = createAction(
  "updateComputePartialDigest"
);

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
    },
    [updateComputePartialDigest]: (state, payload) => {
      return {
        ...state,
        computePartialDigest: payload
      };
    }
  },
  {
    selectedFragment: undefined,
    computePartialDigest: false
  }
);

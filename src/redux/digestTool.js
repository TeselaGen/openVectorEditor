import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const updateSelectedFragment = createAction("updateSelectedFragment");
export const allowPartialDigestsToggle = createAction(
  "allowPartialDigestsToggle"
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [allowPartialDigestsToggle]: state => {
      return {
        ...state,
        allowPartialDigests: !state.allowPartialDigests
      };
    },
    [updateSelectedFragment]: (state, payload) => {
      return {
        ...state,
        selectedFragment: payload
      };
    }
  },
  {
    selectedFragment: undefined,
    allowPartialDigests: false
  }
);

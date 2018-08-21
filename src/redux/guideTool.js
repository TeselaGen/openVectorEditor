import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
import uuid from "uniqid";

// ------------------------------------
// Actions
// ------------------------------------
export const updateGuides = createAction("updateGuides");
// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [updateGuides]: (state, payload) => {
      const idToUse = payload.id || uuid();
      return {
        ...state,
        [idToUse]: { ...(state[idToUse] || {}), ...payload, id: idToUse }
      };
    },
  }
);

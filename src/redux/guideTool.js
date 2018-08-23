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
    [updateGuides]: (state, payload) => { //guides should be 0-based inclusive! aka start: 0, end: 0 is a single basepair feature starting at the first bp
      const idToUse = payload.id || uuid();
      return {
        ...state,
        guides: {
          ...state.guides,
          [idToUse]: { ...(state[idToUse] || {}), ...payload, id: idToUse }
        }
      };
    }
  },
  { options: {}, guides: {} }
);

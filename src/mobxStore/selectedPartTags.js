import { createReducer } from "redux-act";
import createAction from "../redux/utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------

export const updateSelectedPartTags = createAction("UPDATE_SELECTED_PART_TAGS");

// ------------------------------------
// Reducer
// ------------------------------------

export default createReducer(
  {
    [updateSelectedPartTags]: (state, payload) => {
      return { ...state, parts: payload };
    }
  },
  {}
);

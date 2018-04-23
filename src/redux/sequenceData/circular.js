import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const updateCircular = createAction("UPDATE_CIRCULAR");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [updateCircular]: (state, payload) => {
      return payload;
    }
  },
  true
);

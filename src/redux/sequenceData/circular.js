import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const _updateCircular = createAction("UPDATE_CIRCULAR");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [_updateCircular]: (state, payload) => {
      return payload;
    }
  },
  true
);

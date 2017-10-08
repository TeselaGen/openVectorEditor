import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const updateLineageLines = createAction("updateLineageLines");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [updateLineageLines]: (state, payload) => {
      return payload;
    }
  },
  []
);

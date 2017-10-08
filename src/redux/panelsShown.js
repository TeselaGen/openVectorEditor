import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const panelsShownUpdate = createAction("PANELS_SHOWN_UPDATE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [panelsShownUpdate]: (state, payload) => {
      return payload;
    }
  },
  {
    sequence: true,
    circular: true,
    rail: true
  }
);

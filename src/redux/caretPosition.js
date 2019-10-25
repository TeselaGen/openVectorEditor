import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const caretPositionClear = createAction("CARET_POSITION_CLEAR");
export const caretPositionUpdate = createAction("CARET_POSITION_UPDATE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    SELECTION_LAYER_UPDATE: () => {
      //clear the caret if the selection layer is updated!
      return -1;
    },
    [caretPositionClear]: () => {
      return -1;
    },
    [caretPositionUpdate]: (unused, payload) => {
      return typeof payload === "string" ? parseInt(payload, 10) : payload;
    }
  },
  -1
);

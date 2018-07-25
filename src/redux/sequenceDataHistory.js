//./selectionLayer.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const addToUndoStack = createAction("ADD_TO_UNDO_STACK");
export const veUndo = createAction("VE_UNDO_META");
export const veRedo = createAction("VE_REDO_META");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [addToUndoStack]: (state, payload) => {
      return {
        ...state,
        future: [],
        past: [...(state.past||[]), payload]
      };
    },
    [veUndo]: (state, presentState) => {
      return {
        ...state,
        past: (state.past||[]).slice(0, -1),
        future: (state.future||[]).concat(presentState)
      };
    },
    [veRedo]: (state, presentState) => {
      return {
        ...state,
        future: (state.future||[]).slice(0, -1),
        past: (state.past||[]).concat(presentState)
      };
    }
  },
  {
    past: [],
    future: []
  }
);

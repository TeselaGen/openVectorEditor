//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const hoveredAnnotationUpdate = createAction("HOVEREDANNOTATIONUPDATE");
export const hoveredAnnotationClear = createAction("HOVEREDANNOTATIONCLEAR");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [hoveredAnnotationUpdate]: (state, payload) => {
      return payload || null;
    },
    [hoveredAnnotationClear]: () => {
      return "";
    }
  },
  ""
);

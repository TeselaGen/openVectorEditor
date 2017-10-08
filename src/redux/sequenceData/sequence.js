import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const addBps = createAction("addBps");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({}, "");

import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";
import upsertDeleteActionGenerator from "./upsertDeleteActionGenerator";

// ------------------------------------
// Actions
// ------------------------------------
export const upsertPart = createAction("UPSERT_PART");
export const deletePart = createAction("DELETE_PART");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    ...upsertDeleteActionGenerator(upsertPart, deletePart)
  },
  {}
);

import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";
import upsertDeleteActionGenerator from "./upsertDeleteActionGenerator";

// ------------------------------------
// Actions
// ------------------------------------
export const upsertPrimer = createAction("UPSERT_PRIMER");
export const deletePrimer = createAction("DELETE_PRIMER");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    ...upsertDeleteActionGenerator(upsertPrimer, deletePrimer)
  },
  {}
);

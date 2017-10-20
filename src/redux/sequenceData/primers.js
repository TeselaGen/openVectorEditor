import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";
import upsertDeleteActionGenerator from "./upsertDeleteActionGenerator";

// ------------------------------------
// Actions
// ------------------------------------
export const upsertPrimer = createAction("UPSERT_Primer");
export const deletePrimer = createAction("DELETE_Primer");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    ...upsertDeleteActionGenerator(upsertPrimer, deletePrimer)
  },
  {}
);

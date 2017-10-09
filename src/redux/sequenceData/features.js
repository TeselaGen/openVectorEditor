import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";
import upsertDeleteActionGenerator from "./upsertDeleteActionGenerator";

// ------------------------------------
// Actions
// ------------------------------------
export const upsertFeature = createAction("UPSERT_FEATURE");
export const deleteFeature = createAction("DELETE_FEATURE");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    ...upsertDeleteActionGenerator(upsertFeature, deleteFeature)
  },
  {}
);

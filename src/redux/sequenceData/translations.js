import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";
import upsertDeleteActionGenerator from "./upsertDeleteActionGenerator";

// ------------------------------------
// Actions
// ------------------------------------
export const upsertTranslation = createAction("UPSERT_TRANSLATION");
export const deleteTranslation = createAction("DELETE_TRANSLATION");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    ...upsertDeleteActionGenerator(upsertTranslation, deleteTranslation)
  },
  {}
);
